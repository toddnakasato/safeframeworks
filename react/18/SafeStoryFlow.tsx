import type { ReactNode } from "react";
import { fireStoryFlow } from "../../builders/emit";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import type {
  StoryFlowNode,
  FlowStep,
  FlowBranch,
  FlowStory,
} from "safecontracts/components/story-flow";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeStoryFlowProps {
  config: ConfigBase;
  renderStep?: (step: FlowStep, isActive: boolean) => ReactNode;
  onEvent?: OnSafeEvent;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

function Connector({ active }: { active?: boolean }) {
  return (
    <div
      style={{
        width: 32, height: 2, flexShrink: 0, alignSelf: "center",
        background: active ? "var(--sd-success)" : "var(--sd-border)",
      }}
    />
  );
}

function StepCard({
  step, isActive, renderStep, onClick,
}: {
  step: FlowStep; isActive: boolean;
  renderStep?: (step: FlowStep, isActive: boolean) => ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      style={{
        position: "relative", borderRadius: "var(--sd-radius-lg)", padding: "var(--sd-space-md) var(--sd-space-lg)", textAlign: "left",
        flexShrink: 0, cursor: "pointer", transition: "all 0.15s",
        background: "var(--sd-surface-raised)",
        border: isActive ? "1px solid var(--sd-accent)" : "1px solid var(--sd-border)",
        boxShadow: isActive ? "0 0 12px color-mix(in srgb, var(--sd-accent) 30%, transparent)" : "none",
      }}
      onClick={onClick}
    >
      <div style={{ fontSize: "var(--sd-font-md)", fontWeight: 500, color: "var(--sd-text)", marginBottom: "var(--sd-space-sm)" }}>{step.label}</div>
      {renderStep && (
        <div style={{ width: 192, height: 112, overflow: "hidden", borderRadius: "var(--sd-radius-md)", background: "var(--sd-surface)" }}>
          <div style={{ transform: "scale(0.25)", transformOrigin: "top left", width: 768, height: 448, pointerEvents: "none" }}>
            {renderStep(step, isActive)}
          </div>
        </div>
      )}
      {isActive && (
        <div style={{
          position: "absolute", top: -8, right: -8,
          background: "var(--sd-accent)", color: "var(--sd-text)", fontSize: "var(--sd-font-xs)",
          fontWeight: 700, padding: "var(--sd-space-xs) var(--sd-space-sm)", borderRadius: "var(--sd-radius-md)",
        }}>
          LIVE
        </div>
      )}
    </button>
  );
}

function BranchNode({
  branch, activeStep, renderStep, onStepClick,
}: {
  branch: FlowBranch; activeStep: string;
  renderStep?: (step: FlowStep, isActive: boolean) => ReactNode;
  onStepClick: (step: FlowStep) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
      <Connector />
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sd-warning)", fontSize: "var(--sd-font-lg)", flexShrink: 0 }}>
          ◆
        </div>
        <svg style={{ flexShrink: 0 }} width="60" height="100" viewBox="0 0 60 100">
          {branch.arms.map((arm, i) => {
            const y = i === 0 ? 15 : 85;
            const isActive = arm.key === branch.activeArm;
            return (
              <path
                key={arm.key}
                d={`M 0,50 C 30,50 30,${y} 60,${y}`}
                fill="none"
                stroke={isActive ? "var(--sd-success)" : "var(--sd-border)"}
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sd-space-md)" }}>
          {branch.arms.map((arm) => {
            const isActiveArm = arm.key === branch.activeArm;
            return (
              <div
                key={arm.key}
                style={{
                  display: "flex", alignItems: "center", gap: 0,
                  transition: "opacity 0.15s",
                  opacity: isActiveArm ? 1 : 0.35,
                }}
              >
                {arm.nodes.map((node, ni) => (
                  <div key={node.id} style={{ display: "flex", alignItems: "center" }}>
                    {ni > 0 && <Connector active={isActiveArm} />}
                    {node.type === "step" ? (
                      <StepCard step={node} isActive={activeStep === node.id} renderStep={renderStep} onClick={() => onStepClick(node)} />
                    ) : (
                      <BranchNode branch={node} activeStep={activeStep} renderStep={renderStep} onStepClick={onStepClick} />
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NodesRow({
  nodes, activeStep, renderStep, onStepClick,
}: {
  nodes: StoryFlowNode[]; activeStep: string;
  renderStep?: (step: FlowStep, isActive: boolean) => ReactNode;
  onStepClick: (step: FlowStep) => void;
}) {
  return (
    <>
      {nodes.map((node, i) => (
        <div key={node.id} style={{ display: "flex", alignItems: "center" }}>
          {i > 0 && <Connector />}
          {node.type === "step" ? (
            <StepCard step={node} isActive={activeStep === node.id} renderStep={renderStep} onClick={() => onStepClick(node)} />
          ) : (
            <BranchNode branch={node} activeStep={activeStep} renderStep={renderStep} onStepClick={onStepClick} />
          )}
        </div>
      ))}
    </>
  );
}

function StoryRow({
  story, activeStep, renderStep, onStepClick, onPlay, orientation,
}: {
  story: FlowStory; activeStep: string;
  renderStep?: (step: FlowStep, isActive: boolean) => ReactNode;
  onStepClick: (step: FlowStep) => void;
  onPlay: () => void;
  orientation: "horizontal" | "vertical";
}) {
  return (
    <div style={{ marginBottom: "var(--sd-space-3xl)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sd-space-md)", marginBottom: "var(--sd-space-lg)" }}>
        <span style={{ fontSize: "var(--sd-font-md)", fontWeight: 600, color: "var(--sd-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {story.label}
        </span>
        {story.playSequence && story.playSequence.length > 0 && (
          <button
            style={{
              width: 24, height: 24, borderRadius: "50%",
              background: "var(--sd-success)", color: "var(--sd-text)",
              fontSize: "var(--sd-font-sm)", display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", cursor: "pointer",
            }}
            onClick={onPlay}
            title={`Play ${story.label}`}
          >
            ▶
          </button>
        )}
      </div>
      <div
        style={{
          display: "flex", alignItems: "center", overflowX: "auto", paddingBottom: 8,
          ...(orientation === "vertical" ? { flexDirection: "column", alignItems: "flex-start" } : {}),
        }}
      >
        <NodesRow nodes={story.nodes} activeStep={activeStep} renderStep={renderStep} onStepClick={onStepClick} />
      </div>
    </div>
  );
}

export function SafeStoryFlow({ config, renderStep, onEvent }: SafeStoryFlowProps) {
  const { metadata } = config;
  const activeStep = metadata.activeStep ?? "";
  const orientation = metadata.orientation ?? "horizontal";

  return (
    <div style={{ width: "100%" }}>
      {metadata.title && (
        <div style={{ fontSize: "var(--sd-font-lg)", fontWeight: 600, color: "var(--sd-text)", marginBottom: "var(--sd-space-xl)" }}>{metadata.title}</div>
      )}
      {(metadata.stories as any[]).map((story: any) => (
        <StoryRow
          key={story.key}
          story={story}
          activeStep={activeStep}
          renderStep={renderStep}
          onStepClick={(step) => fireStoryFlow(onEvent, "step:click", { step })}
          onPlay={() => fireStoryFlow(onEvent, "story:play", { story: story.key, sequence: story.playSequence })}
          orientation={orientation}
        />
      ))}
    </div>
  );
}
