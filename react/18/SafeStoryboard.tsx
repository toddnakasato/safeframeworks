import type { ReactNode } from "react";

// Legacy types kept inline for backward compatibility
/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

interface StoryStep { scene: string; view: "picker" | "detail"; }
interface StoryDef { name: string; scenes: StoryStep[]; }

export interface SafeStoryboardProps {
  stories: StoryDef[];
  sceneThumbnails: Record<string, ReactNode>;
  activeScene?: string;
  title?: string;
  emptyMessage?: string;
  thumbnailScale?: number;
  thumbnailHeight?: number;
  onSelectScene?: (step: StoryStep) => void;
  onPlayStory?: (story: StoryDef) => void;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function stepKey(step: StoryStep): string {
  return `${step.scene}:${step.view}`;
}

function stepLabel(step: StoryStep): string {
  const name = step.scene.charAt(0).toUpperCase() + step.scene.slice(1);
  const view = step.view === "detail" ? "Detail" : "List";
  return `${name} ${view}`;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function SafeStoryboard({
  stories,
  sceneThumbnails,
  activeScene,
  title,
  emptyMessage,
  thumbnailScale = 0.22,
  thumbnailHeight = 180,
  onSelectScene,
  onPlayStory,
}: SafeStoryboardProps) {
  const innerHeight = thumbnailHeight / thumbnailScale;
  const innerWidth = (thumbnailHeight * 1.5) / thumbnailScale;

  return (
    <div style={{ padding: "var(--sd-space-2xl) var(--sd-space-3xl)", display: "flex", flexDirection: "column", gap: "var(--sd-space-3xl)", overflow: "auto", flex: 1 }}>
      <div style={{ fontSize: "var(--sd-font-2xl)", fontWeight: 600, color: "var(--sd-text)" }}>{title ?? "Storyboards"}</div>

      {stories.map((story) => (
        <div key={story.name} style={{ display: "flex", flexDirection: "column", gap: "var(--sd-space-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sd-space-lg)" }}>
            <span style={{ fontSize: "var(--sd-font-lg)", fontWeight: 500, color: "var(--sd-text-muted)" }}>{story.name}</span>
            {onPlayStory && (
              <button
                onClick={() => onPlayStory(story)}
                style={{
                  background: "none",
                  border: "1px solid var(--sd-border)",
                  borderRadius: "var(--sd-radius-md)",
                  color: "var(--sd-success)",
                  cursor: "pointer",
                  padding: "var(--sd-space-xs) var(--sd-space-md)",
                  fontSize: "var(--sd-font-md)",
                }}
              >
                ▶ Play
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "var(--sd-space-lg)", alignItems: "center", overflowX: "auto" }}>
            {story.scenes.map((step, i) => {
              const key = stepKey(step);
              const isActive = activeScene === step.scene;
              return (
                <div key={`${key}-${i}`} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && (
                    <div style={{
                      width: 24,
                      height: 2,
                      background: isActive ? "var(--sd-success)" : "var(--sd-border)",
                      flexShrink: 0,
                    }} />
                  )}
                  <div
                    onClick={() => onSelectScene?.(step)}
                    style={{
                      width: thumbnailHeight * 1.5,
                      height: thumbnailHeight,
                      overflow: "hidden",
                      borderRadius: "var(--sd-radius-lg)",
                      border: isActive ? "2px solid var(--sd-success)" : "1px solid var(--sd-border)",
                      background: "var(--sd-surface-raised)",
                      cursor: "pointer",
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "var(--sd-space-sm) var(--sd-space-md)",
                      background: "var(--sd-surface-overlay)",
 fontSize: "var(--sd-font-sm)",
                  color: "var(--sd-text-muted)",
                      zIndex: 2,
                    }}>
                      {stepLabel(step)}
                    </div>

                    {isActive && (
                      <div style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
 fontSize: "var(--sd-font-xs)",
                    padding: "var(--sd-space-xs) var(--sd-space-sm)",
                        borderRadius: "var(--sd-radius-pill)",
                        background: "var(--sd-success)",
                        color: "var(--sd-surface)",
                        fontWeight: 600,
                        zIndex: 2,
                      }}>
                        LIVE
                      </div>
                    )}

                    <div style={{
                      transform: `scale(${thumbnailScale})`,
                      transformOrigin: "top left",
                      width: innerWidth,
                      height: innerHeight,
                      pointerEvents: "none",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}>
                      {sceneThumbnails[key] ?? (
                        <div style={{ padding: "var(--sd-space-2xl)", color: "var(--sd-text-dim)", fontSize: "var(--sd-font-lg)" }}>
                          {stepLabel(step)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {stories.length === 0 && (
        <div style={{ color: "var(--sd-text-dim)", fontSize: "var(--sd-font-lg)" }}>{emptyMessage ?? "No stories configured."}</div>
      )}
    </div>
  );
}
