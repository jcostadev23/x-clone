import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock fetch globally before importing the module under test
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Next.js env var
process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000";

// Import after stubbing so the module picks up the env var
const {
  getAllTweets,
  postTweet,
  tweetLikeUnlike,
  addComment,
  signIn,
  postUser,
  getMe,
  getUserById,
} = await import("../utils/apiCalls");

const ok = (body: unknown) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response);

const fail = (status = 400) =>
  Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ success: false }),
  } as Response);

// The `await` creates a microtask boundary that prevents a Vitest v3 / Node v23
// timing issue where synchronous mockReset() in beforeEach causes rejection
// tracking to misfire for the subsequent mockRejectedValue() tests.
beforeEach(async () => { await Promise.resolve(); mockFetch.mockReset(); });
afterEach(() => vi.clearAllMocks());

// ─── getAllTweets ─────────────────────────────────────────────────────────────

describe("getAllTweets", () => {
  it("returns the data array on success", async () => {
    const tweets = [{ _id: "1", description: "hi" }];
    mockFetch.mockResolvedValue(ok({ data: tweets }));
    const result = await getAllTweets();
    expect(result).toEqual(tweets);
  });

  it("returns [] when the request fails", async () => {
    mockFetch.mockResolvedValue(fail(500));
    const result = await getAllTweets();
    expect(result).toEqual([]);
  });

  it("returns [] when fetch throws a network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const result = await getAllTweets();
    expect(result).toEqual([]);
  });

  it("passes the token in the Cookie header", async () => {
    mockFetch.mockResolvedValue(ok({ data: [] }));
    await getAllTweets({ token: "abc123" });
    const [, options] = mockFetch.mock.calls[0];
    expect((options as RequestInit).headers).toMatchObject({
      Cookie: "token=abc123",
    });
  });
});

// ─── postTweet ────────────────────────────────────────────────────────────────

describe("postTweet", () => {
  it("returns the created tweet on success", async () => {
    const tweet = { _id: "99", description: "new tweet" };
    mockFetch.mockResolvedValue(ok({ data: tweet }));
    const result = await postTweet({ description: "new tweet" });
    expect(result).toEqual(tweet);
  });

  it("returns null on HTTP error", async () => {
    mockFetch.mockResolvedValue(fail(401));
    const result = await postTweet({ description: "new tweet" });
    expect(result).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("offline"));
    const result = await postTweet({ description: "new tweet" });
    expect(result).toBeNull();
  });

  it("sends a POST with the tweet body", async () => {
    mockFetch.mockResolvedValue(ok({ data: {} }));
    await postTweet({ description: "hello" });
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain("/tweets");
    expect((options as RequestInit).method).toBe("POST");
    expect(JSON.parse((options as RequestInit).body as string)).toMatchObject({
      tweet: { description: "hello" },
    });
  });
});

// ─── tweetLikeUnlike ─────────────────────────────────────────────────────────

describe("tweetLikeUnlike", () => {
  it("returns the response data on success", async () => {
    mockFetch.mockResolvedValue(ok({ success: true }));
    const result = await tweetLikeUnlike("tweet-1");
    expect(result).toEqual({ success: true });
  });

  it("returns null on HTTP error", async () => {
    mockFetch.mockResolvedValue(fail(403));
    const result = await tweetLikeUnlike("tweet-1");
    expect(result).toBeNull();
  });

  it("sends PUT to the correct endpoint without a userId in the body", async () => {
    mockFetch.mockResolvedValue(ok({ success: true }));
    await tweetLikeUnlike("tweet-42");
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain("/tweets/tweet-42");
    expect((options as RequestInit).method).toBe("PUT");
    // Body should be empty (userId comes from the auth cookie server-side)
    expect((options as RequestInit).body).toBeUndefined();
  });
});

// ─── addComment ───────────────────────────────────────────────────────────────

describe("addComment", () => {
  it("returns the response on success", async () => {
    mockFetch.mockResolvedValue(ok({ success: true }));
    const result = await addComment("tweet-1", {
      id: "user-1",
      comment: "nice",
    });
    expect(result).toEqual({ success: true });
  });

  it("sends only the comment string in the body (not the full object)", async () => {
    mockFetch.mockResolvedValue(ok({ success: true }));
    await addComment("tweet-1", { id: "user-1", comment: "great post" });
    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse((options as RequestInit).body as string);
    expect(body).toEqual({ comment: "great post" });
  });

  it("returns null on failure", async () => {
    mockFetch.mockResolvedValue(fail(500));
    const result = await addComment("tweet-1", { id: "u", comment: "x" });
    expect(result).toBeNull();
  });
});

// ─── signIn ───────────────────────────────────────────────────────────────────

describe("signIn", () => {
  it("returns the response body on success", async () => {
    mockFetch.mockResolvedValue(ok({ success: true }));
    const result = await signIn({ userName: "alice", password: "pass" });
    expect(result).toEqual({ success: true });
  });

  it("returns null on HTTP 400", async () => {
    mockFetch.mockResolvedValue(fail(400));
    const result = await signIn({ userName: "bad", password: "wrong" });
    expect(result).toBeNull();
  });

  it("sends userName and password (not passwordHash)", async () => {
    mockFetch.mockResolvedValue(ok({ success: true }));
    await signIn({ userName: "alice", password: "secret" });
    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse((options as RequestInit).body as string);
    expect(body).toEqual({ userName: "alice", password: "secret" });
    expect(body.passwordHash).toBeUndefined();
  });
});

// ─── postUser ─────────────────────────────────────────────────────────────────

describe("postUser", () => {
  const user = {
    userName: "bob",
    email: "bob@test.com",
    password: "secret",
    birthDate: "1990-01-01",
  };

  it("returns the response on success", async () => {
    mockFetch.mockResolvedValue(ok({ success: true }));
    const result = await postUser(user);
    expect(result).toEqual({ success: true });
  });

  it("returns null on network failure", async () => {
    mockFetch.mockRejectedValue(new Error("offline"));
    const result = await postUser(user);
    expect(result).toBeNull();
  });

  it("wraps the user object in a { user } key", async () => {
    mockFetch.mockResolvedValue(ok({ success: true }));
    await postUser(user);
    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse((options as RequestInit).body as string);
    expect(body).toMatchObject({ user });
  });
});

// ─── getMe ────────────────────────────────────────────────────────────────────

describe("getMe", () => {
  it("returns the user object on success", async () => {
    const me = { userId: "1", userName: "alice" };
    mockFetch.mockResolvedValue(ok({ user: me }));
    const result = await getMe();
    expect(result).toEqual(me);
  });

  it("returns null when not authenticated (non-ok response)", async () => {
    mockFetch.mockResolvedValue(fail(401));
    const result = await getMe();
    expect(result).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("offline"));
    const result = await getMe();
    expect(result).toBeNull();
  });
});

// ─── getUserById ──────────────────────────────────────────────────────────────

describe("getUserById", () => {
  it("returns the user data on success", async () => {
    const user = { _id: "1", userName: "alice" };
    mockFetch.mockResolvedValue(ok({ data: user }));
    const result = await getUserById("1");
    expect(result).toEqual(user);
  });

  it("returns null on HTTP error", async () => {
    mockFetch.mockResolvedValue(fail(404));
    const result = await getUserById("nonexistent");
    expect(result).toBeNull();
  });
});
