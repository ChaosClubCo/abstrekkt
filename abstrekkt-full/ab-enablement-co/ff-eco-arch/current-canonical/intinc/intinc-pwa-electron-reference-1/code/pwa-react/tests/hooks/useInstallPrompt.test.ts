import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useInstallPrompt } from "../../src/hooks/useInstallPrompt";

describe("useInstallPrompt", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("starts with canInstall false", () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.canInstall).toBe(false);
    expect(result.current.isInstalled).toBe(false);
  });

  it("captures beforeinstallprompt event", () => {
    const { result } = renderHook(() => useInstallPrompt());

    const mockEvent = new Event("beforeinstallprompt");
    Object.assign(mockEvent, {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: "accepted" as const }),
    });

    act(() => {
      (mockEvent as Event).preventDefault = vi.fn();
      window.dispatchEvent(mockEvent);
    });

    expect(result.current.canInstall).toBe(true);
  });

  it("promptInstall returns null when no deferred prompt", async () => {
    const { result } = renderHook(() => useInstallPrompt());
    const outcome = await result.current.promptInstall();
    expect(outcome).toBeNull();
  });
});
