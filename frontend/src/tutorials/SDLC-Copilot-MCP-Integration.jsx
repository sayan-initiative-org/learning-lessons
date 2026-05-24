// SDLC-Copilot-MCP-Integration.jsx
// M365 Copilot & Copilot Studio Integration Plan — 8-phase rollout.
// Aesthetic matches the project house style: warm-dark editorial with amber accents.
// (Same design system as MlEngineerTransformation.jsx — Fraunces + Geist + JetBrains Mono.)

import { useState } from "react";
import {
  CheckCircle, AlertTriangle, ChevronRight,
  ChevronDown, Code2, Shield, Users, BarChart3,
  GitBranch, Database, Cloud, Lock, TestTube, Globe, Layers,
  ArrowRight, Info, Terminal, BookOpen, TrendingUp, Package,
  RefreshCw, Target, Cpu, ExternalLink, Copy, Check
} from "lucide-react";

// ───────────────────────────────────────────────────────────────────────────────
// Theme tokens — in lock-step with the rest of the tutorial set
// ───────────────────────────────────────────────────────────────────────────────
const T = {
  bg:        "#0d0d0f",
  bgPanel:   "#15151a",
  bgSunken:  "#0a0a0c",
  border:    "#26262c",
  borderHi:  "#3a3a42",
  text:      "#f0ebe1",
  textMute:  "#8a857c",
  textDim:   "#5c5a55",
  gold:      "#d4a64a",
  terra:     "#c87553",
  sage:      "#7a9966",
  rust:      "#a85544",
  ink:       "#1a1a1f",
  steel:     "#6b8aa8",
};

// Severity / category accents reuse the same palette
const SEVERITY = { Critical: T.rust, High: T.terra, Medium: T.gold, Low: T.sage };
const CATEGORY = {
  reliability: T.steel, performance: T.sage, engagement: T.gold,
  quality: T.terra, cost: T.textMute,
};

// ───────────────────────────────────────────────────────────────────────────────
// Global styles
// ───────────────────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .mcp-root {
      font-family: 'Geist', system-ui, sans-serif;
      background: ${T.bg};
      color: ${T.text};
      font-feature-settings: "ss01", "cv11";
      letter-spacing: -0.005em;
      min-height: 100vh;
    }
    .mcp-root *::selection { background: ${T.gold}; color: ${T.bg}; }
    .display { font-family: 'Fraunces', serif; font-optical-sizing: auto;
               font-variation-settings: "opsz" 96, "SOFT" 50; letter-spacing: -0.03em; }
    .mono { font-family: 'JetBrains Mono', monospace; }

    .hairline { border-top: 1px solid ${T.border}; }

    .h-eyebrow { font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase;
                 color: ${T.terra}; margin-bottom: 10px; font-weight: 500; }
    .h1 { font-family: 'Fraunces', serif; font-size: 44px; line-height: 1.02; letter-spacing: -0.04em;
          font-weight: 400; font-variation-settings: "opsz" 144; }
    .h2 { font-family: 'Fraunces', serif; font-size: 30px; line-height: 1.05; letter-spacing: -0.03em;
          font-weight: 400; font-variation-settings: "opsz" 96; }
    .h3 { font-family: 'Fraunces', serif; font-size: 20px; line-height: 1.2; letter-spacing: -0.02em;
          font-weight: 500; font-variation-settings: "opsz" 36; }
    .h4 { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
          color: ${T.text}; font-weight: 600; }

    .card { background: ${T.bgPanel}; border: 1px solid ${T.border}; border-radius: 4px;
            padding: 20px; transition: border-color .2s; }
    .card:hover { border-color: ${T.borderHi}; }
    .card-flat { background: ${T.bgSunken}; border: 1px solid ${T.border}; border-radius: 4px; padding: 16px; }

    .pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; font-size: 11px;
            letter-spacing: 0.05em; border: 1px solid ${T.border}; border-radius: 999px;
            color: ${T.textMute}; font-family: 'JetBrains Mono', monospace; line-height: 1.4; }
    .pill-gold  { color: ${T.gold};  border-color: ${T.gold}55;  background: ${T.gold}10; }
    .pill-terra { color: ${T.terra}; border-color: ${T.terra}55; background: ${T.terra}10; }
    .pill-sage  { color: ${T.sage};  border-color: ${T.sage}55;  background: ${T.sage}10; }
    .pill-steel { color: ${T.steel}; border-color: ${T.steel}55; background: ${T.steel}10; }
    .pill-rust  { color: ${T.rust};  border-color: ${T.rust}55;  background: ${T.rust}10; }

    .codeblock {
      background: ${T.bgSunken}; border: 1px solid ${T.border}; border-radius: 4px;
      font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.65;
      overflow: hidden; position: relative;
    }
    .codeblock-header {
      display:flex; justify-content:space-between; align-items:center;
      padding: 8px 14px; border-bottom: 1px solid ${T.border};
      font-size: 10.5px; color: ${T.textMute}; letter-spacing: 0.08em; text-transform: uppercase;
    }
    .codeblock pre { padding: 14px 18px; margin: 0; color: ${T.text}; opacity: .88;
                     overflow-x: auto; white-space: pre; }
    .codeblock-copy { background: none; border: none; color: ${T.textMute};
                      font-family: inherit; font-size: inherit; letter-spacing: inherit;
                      cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
                      padding: 0; }
    .codeblock-copy:hover { color: ${T.gold}; }

    table.compare { width: 100%; border-collapse: collapse; font-size: 13px; }
    table.compare th, table.compare td {
      padding: 11px 14px; text-align: left; border-bottom: 1px solid ${T.border};
      vertical-align: top;
    }
    table.compare th { color: ${T.textMute}; font-weight: 500; font-size: 10.5px;
                       letter-spacing: 0.12em; text-transform: uppercase;
                       border-bottom-color: ${T.borderHi}; }
    table.compare td { color: ${T.text}; opacity: .9; }
    table.compare tr:hover td { background: ${T.bgPanel}40; }

    .anim-fade { animation: fadeIn .3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

    .scroll-hide::-webkit-scrollbar { width: 6px; height: 6px; }
    .scroll-hide::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }

    .tab-btn { padding: 9px 0; font-size: 13px; color: ${T.textMute};
               border-bottom: 1px solid transparent; cursor: pointer; transition: all .15s;
               background: none; border-radius: 0; letter-spacing: 0.04em;
               margin-right: 28px; }
    .tab-btn:hover { color: ${T.text}; }
    .tab-btn.active { color: ${T.gold}; border-bottom-color: ${T.gold}; }

    .nav-phase {
      display: flex; align-items: flex-start; gap: 10px;
      width: 100%; text-align: left; cursor: pointer; background: none;
      border: 1px solid transparent; padding: 10px 12px; border-radius: 4px;
      color: ${T.textMute}; transition: all .15s; font-family: inherit;
      letter-spacing: 0.01em;
    }
    .nav-phase:hover { color: ${T.text}; background: ${T.bgPanel}; }
    .nav-phase.active { color: ${T.gold}; background: ${T.ink}; border-color: ${T.gold}40; }
    .nav-phase-label { font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
                       font-family: 'JetBrains Mono', monospace; }
    .nav-phase-name { font-size: 12px; opacity: 0.85; margin-top: 2px; }

    .progress-track { height: 2px; background: ${T.border}; border-radius: 2px; overflow: hidden; }
    .progress-fill  { height: 100%; background: ${T.gold}; transition: width .3s; }

    .step-row {
      width: 100%; display: flex; align-items: flex-start; gap: 11px;
      padding: 9px 10px; border-radius: 3px; background: none; border: none;
      cursor: pointer; text-align: left; transition: background .15s; color: ${T.text};
    }
    .step-row:hover { background: ${T.bgSunken}; }
    .step-check {
      width: 16px; height: 16px; border: 1px solid ${T.border}; border-radius: 3px;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0; background: ${T.bgSunken}; margin-top: 2px;
      transition: all .15s;
    }
    .step-check.done { background: ${T.gold}; border-color: ${T.gold}; }
    .step-check.done::after { content: "✓"; color: ${T.bg}; font-size: 11px; font-weight: 700; }
    .step-id { font-family: 'JetBrains Mono', monospace; color: ${T.textDim};
               font-size: 11px; letter-spacing: 0.05em; margin-right: 8px; }
    .step-text { font-size: 13.5px; line-height: 1.6; color: ${T.text}; opacity: .9; }
    .step-text.done { text-decoration: line-through; opacity: .45; }

    .alert {
      border: 1px solid; border-radius: 4px; padding: 14px 16px;
      display: flex; align-items: flex-start; gap: 10px;
    }
    .alert-danger { background: ${T.rust}10;  border-color: ${T.rust}55;  color: ${T.text}; }
    .alert-warn   { background: ${T.terra}10; border-color: ${T.terra}55; color: ${T.text}; }
    .alert-info   { background: ${T.steel}10; border-color: ${T.steel}55; color: ${T.text}; }
    .alert-note   { background: ${T.gold}10;  border-color: ${T.gold}55;  color: ${T.text}; }

    .auth-step-num {
      width: 22px; height: 22px; border-radius: 50%; background: ${T.gold};
      color: ${T.bg}; font-size: 11px; font-weight: 700; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-family: 'JetBrains Mono', monospace;
    }

    a.ref-link {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      padding: 11px 14px; border: 1px solid ${T.border}; border-radius: 4px;
      color: ${T.text}; text-decoration: none; transition: all .15s; font-size: 13px;
    }
    a.ref-link:hover { border-color: ${T.gold}; color: ${T.gold}; background: ${T.gold}08; }
  `}</style>
);

// ───────────────────────────────────────────────────────────────────────────────
// DATA  (unchanged content — only the surrounding presentation is restyled)
// ───────────────────────────────────────────────────────────────────────────────

const PHASES = [
  {
    id: 0,
    label: "Phase 0",
    name: "Pre-Flight",
    duration: "Days 1–2",
    icon: Shield,
    accent: T.steel,
    goal: "Lock down access, accounts, and decisions before any code is written.",
    steps: [
      { id: "0.1", text: "Verify M365 Copilot + Copilot Studio licensing for pilot users" },
      { id: "0.2", text: "Create Azure AD app registration with JIRA, TFS, Graph delegated permissions" },
      { id: "0.3", text: "Enable On-Behalf-Of (OBO) flow on app registration" },
      { id: "0.4", text: "Document transport (Streamable HTTP), hosting (ACA), auth (OBO), tool count decisions" },
      { id: "0.5", text: "Check tenant External app policies — confirm third-party OAuth permitted" },
      { id: "0.6", text: "Engage tenant admin early for pre-approval (avoid Phase 4 blockers)" },
      { id: "0.7", text: "Coordinate with Atlassian admin to whitelist MCP domain in External app policies" },
    ],
    exitCriteria: "Azure AD app live, licenses confirmed, decisions documented, admins engaged.",
    prerequisites: [
      { item: "Microsoft 365 Copilot License", who: "Per pilot user", risk: "Blocks M365 DA surface" },
      { item: "Copilot Studio License", who: "Per user / per message", risk: "Blocks Copilot Studio surface" },
      { item: "Azure Subscription", who: "With Container Apps + OpenAI quota", risk: "Blocks deployment" },
      { item: "JIRA Cloud Admin Access", who: "OAuth app registration", risk: "Blocks OBO chain" },
      { item: "Azure DevOps/TFS Admin", who: "Delegated permission consent", risk: "Blocks TFS writeback" },
    ],
    keyDecisions: [
      { decision: "Transport Protocol", choice: "Streamable HTTP", rationale: "SSE deprecated Aug 2025 in Copilot Studio" },
      { decision: "Hosting", choice: "Azure Container Apps", rationale: "Always-warm, auto-scale, managed identity" },
      { decision: "Auth Pattern", choice: "Azure AD OBO", rationale: "Preserves user identity end-to-end" },
      { decision: "Tool Count", choice: "9 tools, capped at 15", rationale: ">5 tools triggers semantic routing — descriptions critical" },
      { decision: "Build vs Buy", choice: "Custom MCP server", rationale: "Atlassian MCP = CRUD only; our value is LangGraph orchestration" },
    ],
    risks: ["Tenant admin blocks M365 DA approval (R-01)", "Atlassian external app policy blocks OAuth (R-14)"],
    challenges: ["Conditional Access policies may block OBO flow", "Per-user Atlassian licensing gaps"],
  },
  {
    id: 1,
    label: "Phase 1",
    name: "Build MCP Server",
    duration: "Days 3–10",
    icon: Code2,
    accent: T.gold,
    goal: "A working, locally testable MCP server exposing all 9 tools with real LangGraph execution.",
    steps: [
      { id: "1.1", text: "Scaffold Python project — fastmcp, fastapi, uvicorn, httpx, azure-identity, pydantic" },
      { id: "1.2", text: "Implement all 9 tool stubs with mock data — get response shapes right first" },
      { id: "1.3", text: "Wire Streamable HTTP transport on /mcp endpoint with stateless_http=True" },
      { id: "1.4", text: "Connect generation tools to existing LangGraph workflows + Redis job queue" },
      { id: "1.5", text: "Implement Azure AD JWT validation via AzureJWTVerifier + OBO middleware" },
      { id: "1.6", text: "Test all 9 tools locally with MCP Inspector" },
      { id: "1.7", text: "Write golden-set tests for all tools (unit + integration)" },
    ],
    exitCriteria: "All 9 tools callable via MCP Inspector with real LangGraph execution and auth validated.",
    tools: [
      { name: "generate_user_stories",  type: "Generation",  async: true,  description: "Generate User Stories from project/epic context. Fetches existing tickets first." },
      { name: "generate_test_cases",    type: "Generation",  async: true,  description: "Generate Test Cases from User Story IDs." },
      { name: "generate_test_scripts",  type: "Generation",  async: true,  description: "Generate Gherkin/BDD scripts from Test Case IDs." },
      { name: "refine_artifact",        type: "Refinement",  async: false, description: "Refine a specific User Story or Test Case via NL instruction." },
      { name: "add_missing_scenarios",  type: "Refinement",  async: true,  description: "Identify and add missing test scenarios to existing artifacts." },
      { name: "regenerate_all",         type: "Refinement",  async: true,  description: "Regenerate all artifacts for a project scope." },
      { name: "get_job_status",         type: "Async Mgmt",  async: false, description: "Poll status of an async generation job (IN_PROGRESS/COMPLETED/FAILED)." },
      { name: "get_job_result",         type: "Async Mgmt",  async: false, description: "Fetch completed output of a generation job." },
      { name: "fetch_existing_tickets", type: "Context",     async: false, description: "Fetch existing JIRA/TFS tickets as grounding context." },
    ],
    codeSnippet: `# src/server.py — FastMCP entry point
from fastmcp import FastMCP
from fastmcp.server.auth import RemoteAuthProvider
from fastmcp.server.auth.providers.azure import AzureJWTVerifier
import os

verifier = AzureJWTVerifier(
  client_id=os.environ["AZURE_CLIENT_ID"],
  tenant_id=os.environ["AZURE_TENANT_ID"],
  required_scopes=["access_as_user"],
)
auth = RemoteAuthProvider(
  token_verifier=verifier,
  authorization_servers=["https://login.microsoftonline.com/{tenant}/v2.0"],
  base_url="https://sdlc-copilot-mcp.yourorg.com",
)
mcp = FastMCP(
  name="sdlc-copilot",
  auth=auth,
  transport="streamable-http",
  stateless_http=True,  # Required for multi-replica ACA
)`,
    risks: ["OBO token cache leaks across users (R-03)", "Tool routing accuracy below 80% (R-06)"],
    challenges: ["Tool description quality directly determines orchestrator routing accuracy", "Async job pattern must be airtight — no synchronous LangGraph calls"],
  },
  {
    id: 2,
    label: "Phase 2",
    name: "Deploy to Azure",
    duration: "Days 11–13",
    icon: Cloud,
    accent: T.steel,
    goal: "Production-grade hosting on Azure Container Apps with monitoring, auth, and security hardening.",
    steps: [
      { id: "2.1", text: "Multi-stage Dockerfile — python:3.12-slim, non-root user, /health endpoint" },
      { id: "2.2", text: "Push image to Azure Container Registry (ACR)" },
      { id: "2.3", text: "Deploy to Azure Container Apps: min 2, max 10 replicas, scale on HTTP concurrency" },
      { id: "2.4", text: "Bind Azure Key Vault secrets via managed identity — no secrets in env vars" },
      { id: "2.5", text: "Configure custom domain + TLS on Azure Front Door" },
      { id: "2.6", text: "Enable WAF on Front Door — OWASP ruleset" },
      { id: "2.7", text: "Wire App Insights — alert on error rate >5% over 5 min" },
      { id: "2.8", text: "Add permissive Accept header handling (workaround for M365 DA bug)" },
      { id: "2.9", text: "Rate limit: 60 req/min per user at Front Door level" },
    ],
    exitCriteria: "MCP server live at production URL, monitored, callable with valid Azure AD token, error rate <1%.",
    infra: [
      { resource: "Azure Container Apps",        tier: "Consumption + Dedicated", purpose: "MCP server hosting" },
      { resource: "Azure Container Registry",    tier: "Standard",                purpose: "Image storage" },
      { resource: "Azure Front Door",            tier: "Standard",                purpose: "WAF, DDoS, routing, TLS" },
      { resource: "Azure Key Vault",             tier: "Standard",                purpose: "Secrets, client certs" },
      { resource: "Azure Cache for Redis",       tier: "Premium P1",              purpose: "Job queue, token cache, blackboard" },
      { resource: "App Insights + Log Analytics",tier: "Pay-as-you-go",           purpose: "Observability, alerts" },
      { resource: "Azure OpenAI",                tier: "PTU + Standard fallback", purpose: "LLM inference" },
    ],
    risks: ["Cold starts if min replicas set to 0 (mitigated by ACA min 2)", "Azure OpenAI rate limit under load (R-08)"],
    challenges: ["stateless_http=True required for multi-replica — test state management carefully", "Front Door routing rules must not break SSE upgrade paths"],
  },
  {
    id: 3,
    label: "Phase 3",
    name: "Copilot Studio",
    duration: "Days 14–18",
    icon: Layers,
    accent: T.terra,
    goal: "Working Copilot Studio agent calling all 9 MCP tools, deployed to Teams for pilot group.",
    steps: [
      { id: "3.1", text: "Create new Copilot Studio agent: 'SDLC Copilot'" },
      { id: "3.2", text: "Connect MCP server via onboarding wizard — use Dynamic Discovery auth (NOT Manual OAuth)" },
      { id: "3.3", text: "Verify all 9 tools appear in tool listing — if empty, recheck External App Policies" },
      { id: "3.4", text: "Author system instructions: async polling rules, artifact presentation format, refinement behavior" },
      { id: "3.5", text: "Build 6 conversation topics with slot-filling for missing parameters" },
      { id: "3.6", text: "Test each topic in Copilot Studio preview — verify activity map shows correct tool routing" },
      { id: "3.7", text: "Deploy to Microsoft Teams channel — generate Teams app package" },
      { id: "3.8", text: "Sideload to pilot team channel" },
    ],
    exitCriteria: "Pilot team can invoke all 6 flows from Teams chat with correct tool routing.",
    topics: [
      { name: "Generate User Stories",   triggers: "create stories, draft epic, user stories for X", tools: "fetch_existing_tickets → generate_user_stories → get_job_status → get_job_result" },
      { name: "Generate Test Cases",     triggers: "write tests, test cases for US-XXX, test scenarios", tools: "generate_test_cases → get_job_status → get_job_result" },
      { name: "Generate BDD Scripts",    triggers: "gherkin, bdd scripts, convert to gherkin", tools: "generate_test_scripts → get_job_status → get_job_result" },
      { name: "Refine Artifact",         triggers: "refine, improve, fix US-112, add to this story", tools: "refine_artifact" },
      { name: "Add Missing Scenarios",   triggers: "what am I missing, missing scenarios, gaps", tools: "add_missing_scenarios → get_job_result" },
      { name: "Regenerate All",          triggers: "start over, regenerate sprint, redo everything", tools: "regenerate_all → get_job_status → get_job_result" },
    ],
    authNote: "Use Dynamic Discovery (OAuth 2.1 + DCR) in the MCP wizard — NOT Manual OAuth 2.0. Atlassian's MCP also requires this mode. Many enterprise tenants block external OAuth apps by default — resolve in Phase 0.",
    risks: ["Power Platform connector payload >5MB causes AsyncResponsePayloadTooLarge (R-12)", "Wrong topic/tool selected due to weak descriptions (R-06)"],
    challenges: ["Tool listing empty after wizard = External App Policy not set", "Async polling must be encoded in topic instructions explicitly"],
  },
  {
    id: 4,
    label: "Phase 4",
    name: "M365 Declarative Agent",
    duration: "Days 19–25",
    icon: Globe,
    accent: T.gold,
    goal: "SDLC Copilot accessible as a Declarative Agent in M365 Copilot chat with MCP App UI cards.",
    steps: [
      { id: "4.1", text: "Install M365 Agents Toolkit VS Code extension" },
      { id: "4.2", text: "Scaffold: Declarative Agent with MCP plugin, schema v1.7" },
      { id: "4.3", text: "Author declarativeAgent.json — name, instructions, conversation starters, MCP capability" },
      { id: "4.4", text: "Author ai-plugin.json — RemoteMCPServer runtime, run_for_functions list" },
      { id: "4.5", text: "Design Adaptive Card templates: User Story, Test Case table, Gherkin code, Diff view" },
      { id: "4.6", text: "Sideload agent personally via Toolkit — test all flows at m365.cloud.microsoft/chat" },
      { id: "4.7", text: "Package as .zip — submit to Teams Admin Center → Manage Apps → Custom Apps" },
      { id: "4.8", text: "Obtain admin approval for pilot user group" },
    ],
    exitCriteria: "Pilot users invoke SDLC Copilot from M365 Copilot chat with correct Adaptive Card rendering.",
    manifestSnippet: `// declarativeAgent.json (schema v1.7)
{
  "name": "SDLC Copilot",
  "description": "Generate & refine User Stories, Test Cases, BDD scripts from JIRA/TFS",
  "instructions": "...[async polling rules, artifact format, refinement behavior]...",
  "conversation_starters": [
    { "title": "Generate user stories",
      "text": "Generate user stories for the Payment Gateway epic in project PAY" },
    { "title": "Refine a story",
      "text": "Refine US-112 to handle timeout scenarios" }
  ],
  "actions": [{ "id": "sdlc-copilot-mcp", "file": "ai-plugin.json" }]
}

// ai-plugin.json
{
  "runtimes": [{
    "type": "RemoteMCPServer",
    "auth": { "type": "OAuthPluginVault", "reference_id": "SDLC_COPILOT_OAUTH" },
    "spec": { "url": "https://sdlc-copilot-mcp.yourorg.com/mcp" },
    "run_for_functions": ["generate_user_stories", "generate_test_cases",
      "generate_test_scripts", "refine_artifact", "add_missing_scenarios",
      "regenerate_all", "get_job_status", "get_job_result", "fetch_existing_tickets"]
  }]
}`,
    mcpAppCards: [
      { card: "User Story Card",       content: "Title, As/I want/So that, Acceptance Criteria, Story Points, Confidence score", actions: "Accept & Push to JIRA | Refine | Regenerate" },
      { card: "Test Case Table",       content: "TC ID, Scenario, Steps, Expected Result, Coverage badge",                       actions: "Push All | Refine Flagged | Export .xlsx" },
      { card: "Gherkin Code Block",    content: "Formatted Given/When/Then in fenced code block",                                actions: "Copy | Push as .feature | Refine Scenario" },
      { card: "Refinement Diff View",  content: "Before/after side-by-side, changed lines highlighted, confidence delta",        actions: "Accept Changes | Revert | Refine More" },
    ],
    knownIssue: "M365 DA runtime sends Accept: application/json only — missing text/event-stream. Spec-compliant servers return HTTP 406. Mitigation: configure your MCP server to accept application/json alone until Microsoft patches this.",
    risks: ["M365 DA Accept header bug breaks all tools (R-02 — highest priority)", "Tenant admin approval lag delays rollout (R-01)"],
    challenges: ["Schema v1.5 docs still index first in search — always use v1.7 explicitly", "Adaptive Cards render inconsistently across Teams desktop/mobile/M365 web"],
  },
  {
    id: 5,
    label: "Phase 5",
    name: "JIRA / TFS Writeback",
    duration: "Days 26–30",
    icon: Database,
    accent: T.sage,
    goal: "Close the loop — generated artifacts pushed back to JIRA / TFS with full parent-child linking.",
    steps: [
      { id: "5.1", text: "Add push_user_stories_to_jira tool — creates issues with Epic link, labels SDLC-Copilot-Generated" },
      { id: "5.2", text: "Add push_test_cases_to_tfs tool — creates Test Case work items linked to User Stories" },
      { id: "5.3", text: "Add link_artifacts tool — links generated children to source epic/feature" },
      { id: "5.4", text: "Add undo_last_writeback tool — soft-delete with transaction ID rollback" },
      { id: "5.5", text: "Build confirmation UX: before/after preview card with explicit Accept button" },
      { id: "5.6", text: "Implement idempotency: same generation + job ID = no duplicate tickets" },
      { id: "5.7", text: "Add /auth-check diagnostic tool — returns which OBO hop is failing" },
    ],
    exitCriteria: "Generated stories and test cases appear in JIRA/TFS with correct parent-child links and user attribution.",
    writebackTools: [
      { tool: "push_user_stories_to_jira", target: "JIRA Cloud / Server / DC", notes: "Requires write:jira-work scope. Idempotent via job_id tag." },
      { tool: "push_test_cases_to_tfs",    target: "Azure DevOps / TFS",       notes: "Creates Test Case work items. Links to User Story." },
      { tool: "link_artifacts",            target: "JIRA + TFS",                notes: "Parent-child issue links. Epic → Story → Test Case chain." },
      { tool: "undo_last_writeback",       target: "JIRA + TFS",                notes: "Soft delete. Returns transaction_id for audit." },
    ],
    authChain: [
      { step: 1, label: "M365 User Identity",      detail: "Azure AD Bearer token" },
      { step: 2, label: "MCP Server validates",    detail: "AzureJWTVerifier checks scope" },
      { step: 3, label: "OBO Exchange → JIRA",     detail: "azure-identity ConfidentialClientApp.acquire_token_on_behalf_of()" },
      { step: 4, label: "OBO Exchange → TFS",      detail: "Same pattern, different scope" },
      { step: 5, label: "Writeback as user",       detail: "Audit trail shows actual user, not service principal" },
    ],
    risks: ["Per-user JIRA write permissions not granted (R-10)", "OBO token TTL mismatch causes mid-session failures (R-03)"],
    challenges: ["JIRA Cloud vs Server vs Data Center: three different auth models — abstract behind connector interface", "Service account tokens cause 401 — always use standard user OBO tokens"],
  },
  {
    id: 6,
    label: "Phase 6",
    name: "Pilot & Hardening",
    duration: "Days 31–40",
    icon: TestTube,
    accent: T.gold,
    goal: "Real usage by 10–15 users, measured across both surfaces, iterated weekly based on feedback.",
    steps: [
      { id: "6.1", text: "Recruit pilot group: 1 Product Owner team, 1 QA team, 1 BA team" },
      { id: "6.2", text: "Set up App Insights dashboard with all 10 success metrics" },
      { id: "6.3", text: "Run onboarding session + office hours for pilot users" },
      { id: "6.4", text: "Week 1: observe, log all tool routing decisions, no changes" },
      { id: "6.5", text: "Week 2: tune tool descriptions for any misrouting observed" },
      { id: "6.6", text: "Weekly 30-min sync with pilot users — structured feedback form" },
      { id: "6.7", text: "Run full golden-set LLM-as-Judge evaluation — baseline quality score" },
      { id: "6.8", text: "Load test: 50 concurrent users — verify auto-scale and Redis queue" },
    ],
    exitCriteria: "All success metrics above target thresholds for 2 consecutive weeks.",
    metrics: [
      { metric: "Generation completion rate",        target: ">90%",            category: "reliability" },
      { metric: "End-to-end latency P95",            target: "<30s",            category: "performance" },
      { metric: "Refinement adoption rate",          target: ">40% of sessions",category: "engagement" },
      { metric: "JIRA/TFS writeback success rate",   target: ">95%",            category: "reliability" },
      { metric: "Tool routing accuracy",             target: ">95%",            category: "quality" },
      { metric: "User-reported quality (thumbs up)", target: ">80%",            category: "quality" },
      { metric: "Plugin/agent error rate",           target: "<5%",             category: "reliability" },
      { metric: "Cost per generation",               target: "<$0.50",          category: "cost" },
      { metric: "LLM-as-Judge quality score",        target: "No >5% weekly drop", category: "quality" },
      { metric: "Weekly active users",               target: "+10% MoM post-rollout", category: "engagement" },
    ],
    testingLayers: [
      { layer: "Unit Tests",              count: "~200",        scope: "Tool logic, schemas, auth validation, parameter parsing",      framework: "pytest + pytest-asyncio" },
      { layer: "Integration Tests",       count: "~80",         scope: "MCP + LangGraph + JIRA/TFS + Redis end-to-end",                framework: "pytest + httpx" },
      { layer: "E2E Tests",               count: "~30",         scope: "Multi-turn flows via MCP Inspector + Playwright",              framework: "Playwright" },
      { layer: "Golden Set (LLM Judge)",  count: "30 inputs",   scope: "Representative inputs scored across 5 judge layers nightly",   framework: "DeepEval + RAGAS" },
      { layer: "Security Tests",          count: "10 scenarios",scope: "Prompt injection, tenant isolation, token leakage, rate limit",framework: "Manual + OWASP ZAP" },
    ],
    risks: ["Pilot users churn from poor first impression (R-13)", "LLM output quality regresses silently (R-05)"],
    challenges: ["Two surfaces = two user populations with different expectations — never average metrics", "Tool description tuning must be data-driven, not intuition-driven"],
  },
  {
    id: 7,
    label: "Phase 7",
    name: "Org-Wide Rollout",
    duration: "Days 41–50",
    icon: Users,
    accent: T.terra,
    goal: "Production-ready, governed, fully documented, generally available to all licensed users.",
    steps: [
      { id: "7.1", text: "Scale Container Apps: min 5 replicas, enable geo-redundancy" },
      { id: "7.2", text: "Enable Azure DDoS Standard on Front Door" },
      { id: "7.3", text: "Document DLP policies for Power Platform connector" },
      { id: "7.4", text: "Enable Conditional Access policy scoped to SDLC Copilot app registration" },
      { id: "7.5", text: "Enable full audit logging — retain 1 year in Log Analytics" },
      { id: "7.6", text: "Publish user guide to Confluence / SharePoint" },
      { id: "7.7", text: "Record 5-min Loom demo per surface (M365 Copilot + Teams bot)" },
      { id: "7.8", text: "Rollout Week 1: 50 users. Week 2: 200 users. Week 3: All eligible users." },
      { id: "7.9", text: "Monitor metrics at each gate — hold if error rate >5%" },
    ],
    exitCriteria: "SDLC Copilot generally available with <2% error rate across both surfaces.",
    rolloutGates: [
      { gate: "Week 1", users: "50",           criteria: "Error rate <5%, no P0 incidents" },
      { gate: "Week 2", users: "200",          criteria: "P95 latency <30s, routing accuracy >90%" },
      { gate: "Week 3", users: "All licensed", criteria: "All metrics green for 3 consecutive days" },
    ],
    compliance: [
      { framework: "SOC 2",      controls: "Access control, audit logging, change management, encryption" },
      { framework: "GDPR",       controls: "Data minimization, right-to-erasure (delete Redis user data), DPIA" },
      { framework: "PCI-DSS",    controls: "PII redaction layer mandatory if card data in JIRA tickets" },
      { framework: "ISO 27001",  controls: "Tied to Azure tenant ISMS — document in existing ISMS scope" },
    ],
    risks: ["Tenant admin approval lag (R-01)", "Cost explosion with large user base (R-04)"],
    challenges: ["Phased rollout requires feature flags or license-group gating", "DLP policy must cover Power Platform connector — coordinate with IT security before rollout"],
  },
  {
    id: 8,
    label: "Phase 8",
    name: "Continuous Improvement",
    duration: "Ongoing",
    icon: RefreshCw,
    accent: T.sage,
    goal: "Compound value over time: quality improvements, new tools, spec upgrades, cost optimization.",
    steps: [
      { id: "8.1", text: "Monthly: Tool description tuning based on routing accuracy data" },
      { id: "8.2", text: "Monthly: Review cost dashboard — optimize model routing if cost/generation rising" },
      { id: "8.3", text: "Quarterly: Add new tools based on user feature requests from feedback backlog" },
      { id: "8.4", text: "Quarterly: MCP SDK upgrade — test against dev tenant before prod" },
      { id: "8.5", text: "Quarterly: M365 Agents Toolkit schema review — track v1.7 → v1.8 + beyond" },
      { id: "8.6", text: "Always: Monitor OfficeDev GitHub for M365 DA Accept header bug patch" },
      { id: "8.7", text: "6-month: Evaluate Atlassian MCP as hybrid downstream connector (ADR-8 revisit)" },
      { id: "8.8", text: "6-month: Evaluate PTU vs Standard OpenAI billing based on actual usage patterns" },
      { id: "8.9", text: "12-month: MCP v2 spec readiness assessment and migration plan" },
    ],
    exitCriteria: "No exit — this phase runs indefinitely with quarterly OKRs.",
    cadence: [
      { frequency: "Weekly",    activity: "Golden-set LLM-as-Judge scoring + regression alert" },
      { frequency: "Monthly",   activity: "Tool description review, cost dashboard review, user feedback triage" },
      { frequency: "Quarterly", activity: "New tools release, schema upgrades, vendor roadmap review" },
      { frequency: "6-Month",   activity: "Architecture review, ADR revisits, major feature evaluation" },
      { frequency: "Annual",    activity: "Full penetration test, compliance audit, TCO review" },
    ],
    futureChallenges: [
      "MCP spec v1 → v2 likely has breaking changes within 12 months — versioned endpoints are the mitigation",
      "Google A2A, Anthropic MCP, OpenAI protocol convergence or fragmentation — monitor",
      "Microsoft roadmap volatility (Agent 365, Frontier rebranding) — build on open primitives",
      "Tool count creep past 15 — split into domain servers (generation, refinement, writeback)",
    ],
    risks: ["MCP spec evolution (R-12)", "Microsoft roadmap volatility (R-09)"],
    challenges: ["Documentation rot — date-stamp all docs, quarterly link review", "Team knowledge: M365 schema changes land in Toolkit before docs catch up"],
  },
];

const COST_DATA = {
  perGeneration: [
    { component: "Input tokens (context + system prompt)",  tokens: "~6,000", cost: "$0.015" },
    { component: "Embedding for retrieval (5 queries)",     tokens: "~2,500", cost: "$0.0003" },
    { component: "Cross-encoder reranking (compute)",       tokens: "—",      cost: "$0.001" },
    { component: "Generation output (5 user stories + AC)", tokens: "~3,000", cost: "$0.030" },
    { component: "LLM-as-Judge (5 stories × 5 dimensions)", tokens: "~3,000", cost: "$0.011" },
    { component: "Total per generation",                    tokens: "~14,500", cost: "$0.057" },
  ],
  infrastructure: [
    { resource: "Azure Container Apps (5 replicas)",                     cost: "$450/mo" },
    { resource: "Azure Cache for Redis Premium P1",                      cost: "$420/mo" },
    { resource: "Azure OpenAI (100 users × 20/day × 22 days)",           cost: "$3,500/mo" },
    { resource: "Azure AI Content Safety (PII detection)",               cost: "$200/mo" },
    { resource: "App Insights + Log Analytics",                          cost: "$150/mo" },
    { resource: "Azure Front Door Standard",                             cost: "$120/mo" },
    { resource: "Azure Key Vault",                                       cost: "$10/mo" },
  ],
  roi: { monthlyCostPerUser: "$48", timeSavedPerGeneration: "25 min", timePerMonth: "9 hrs", hourlyRate: "$80", monthlyValue: "$720", roi: "~15x" },
};

const TOP_RISKS = [
  { id: "R-01", risk: "Tenant admin blocks M365 DA approval",         severity: "Critical", prob: 3, score: 12, phase: "Phase 0" },
  { id: "R-02", risk: "M365 DA Accept header bug breaks all tools",   severity: "High",     prob: 5, score: 15, phase: "Phase 4" },
  { id: "R-03", risk: "OBO token cache leaks across users",           severity: "Critical", prob: 1, score: 4,  phase: "Phase 1" },
  { id: "R-04", risk: "Generation cost explodes past budget",         severity: "High",     prob: 3, score: 9,  phase: "Phase 7" },
  { id: "R-05", risk: "LLM output quality regresses silently",        severity: "High",     prob: 3, score: 9,  phase: "Phase 6" },
  { id: "R-06", risk: "Tool routing accuracy below 80%",              severity: "High",     prob: 4, score: 12, phase: "Phase 3" },
  { id: "R-07", risk: "Prompt injection from JIRA tickets",           severity: "High",     prob: 3, score: 9,  phase: "All" },
  { id: "R-10", risk: "JIRA/TFS auth fails for subset of users",      severity: "High",     prob: 3, score: 9,  phase: "Phase 5" },
  { id: "R-13", risk: "Pilot users churn from poor first impression", severity: "High",     prob: 3, score: 9,  phase: "Phase 6" },
  { id: "R-14", risk: "Atlassian admin blocks external app",          severity: "High",     prob: 3, score: 9,  phase: "Phase 0" },
];

const REFS = [
  { label: "Copilot Studio — Connect to existing MCP server",         url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent", category: "Microsoft Official" },
  { label: "M365 Copilot — Build plugins from MCP server",            url: "https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/build-mcp-plugins", category: "Microsoft Official" },
  { label: "MCP GA in Copilot Studio (March 2026)",                   url: "https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/model-context-protocol-mcp-is-now-generally-available-in-microsoft-copilot-studio/", category: "Microsoft Official" },
  { label: "MCP Apps in M365 Copilot (April 2026)",                   url: "https://devblogs.microsoft.com/microsoft365dev/mcp-apps-now-available-in-copilot-chat", category: "Microsoft Official" },
  { label: "Azure MCP Server — Python quickstart",                    url: "https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/get-started/languages/python", category: "Microsoft Official" },
  { label: "Model Context Protocol Specification (2025-03-26)",       url: "https://modelcontextprotocol.io/specification/2025-03-26/basic/transports", category: "MCP Standard" },
  { label: "FastMCP Documentation",                                   url: "https://gofastmcp.com", category: "MCP Standard" },
  { label: "FastMCP Azure Auth Provider",                             url: "https://gofastmcp.com/python-sdk/fastmcp-server-auth-providers-azure", category: "MCP Standard" },
  { label: "Azure Samples — Remote MCP Web App Python Auth",          url: "https://github.com/Azure-Samples/remote-mcp-webapp-python-auth", category: "MCP Standard" },
  { label: "Atlassian Remote MCP Server (GitHub)",                    url: "https://github.com/atlassian/atlassian-mcp-server", category: "Atlassian" },
  { label: "Wiring Atlassian MCP in Copilot Studio (May 2026)",       url: "https://microsoft.github.io/mcscatblog/posts/atlassian-jira-remote-mcp-copilot-studio/", category: "Atlassian" },
  { label: "Declarative Agents for M365 Copilot — Plainly",           url: "https://claw.aguidetocloud.com/microsoft/declarative-agents/overview/", category: "Community" },
  { label: "M365 DA Accept header bug tracker",                       url: "https://github.com/OfficeDev/microsoft-365-agents-toolkit/issues/15421", category: "Community" },
  { label: "Securing MCP Servers with Azure AD JWT + RBAC",           url: "https://medium.com/@khansaima/securing-mcp-servers-with-azure-ad-and-jwt-based-role-authorization-d8c8aeadb7f5", category: "Community" },
  { label: "M365 Copilot Declarative Agents — What's New April 2026", url: "https://www.voitanos.io/blog/microsoft-365-copilot-declarative-agents-whats-new-202604-april-2026/", category: "Community" },
  { label: "Adaptive Cards Designer",                                 url: "https://adaptivecards.io/designer/", category: "Tools" },
  { label: "MCP Inspector",                                           url: "https://github.com/modelcontextprotocol/inspector", category: "Tools" },
];

// ───────────────────────────────────────────────────────────────────────────────
// Building blocks
// ───────────────────────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, accent = T.gold }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
      <div style={{
        marginTop: 2, padding: 7, background: T.bgSunken, border: `1px solid ${T.border}`,
        borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={14} color={accent} strokeWidth={1.5} />
      </div>
      <div>
        <div className="h4">{title}</div>
        {subtitle && <p style={{ color: T.textMute, fontSize: 12, marginTop: 4 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function CodeBlock({ code, language = "python", title }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="codeblock">
      <div className="codeblock-header">
        <span>{title || language}</span>
        <button className="codeblock-copy mono" onClick={handleCopy} aria-label="Copy code">
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="scroll-hide">{code}</pre>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Phase content blocks — preserved behaviour, restyled
// ───────────────────────────────────────────────────────────────────────────────
function PhaseSteps({ phase, checkedSteps, onToggle }) {
  return (
    <div className="card">
      <SectionHeader icon={CheckCircle} title="Implementation Steps" subtitle={`${phase.steps.length} steps to complete`} accent={phase.accent} />
      <div>
        {phase.steps.map((step) => {
          const done = checkedSteps.has(step.id);
          return (
            <button key={step.id} onClick={() => onToggle(step.id)} className="step-row">
              <span className={`step-check ${done ? "done" : ""}`} />
              <span>
                <span className="step-id">Step {step.id}</span>
                <span className={`step-text ${done ? "done" : ""}`}>{step.text}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Target size={14} color={T.gold} strokeWidth={1.5} style={{ marginTop: 3, flexShrink: 0 }} />
          <div>
            <p style={{ color: T.textMute, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Exit Criteria</p>
            <p style={{ color: T.text, fontSize: 13.5, marginTop: 6, lineHeight: 1.6, opacity: .92 }}>{phase.exitCriteria}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhaseRisks({ phase }) {
  if (!phase.risks || phase.risks.length === 0) return null;
  return (
    <div className="card">
      <SectionHeader icon={AlertTriangle} title="Phase Risks" accent={T.terra} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {phase.risks.map((r, i) => (
          <div key={i} className="alert alert-warn">
            <AlertTriangle size={14} color={T.terra} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 13, color: T.text, opacity: .9, lineHeight: 1.55 }}>{r}</span>
          </div>
        ))}
      </div>
      {phase.challenges && (
        <div style={{ marginTop: 14 }}>
          <p style={{ color: T.textMute, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            Key Watch-Outs
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {phase.challenges.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Info size={13} color={T.textMute} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 3 }} />
                <span style={{ fontSize: 12.5, color: T.text, opacity: .8, lineHeight: 1.55 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Phase0Content({ phase }) {
  return (
    <>
      <div className="card">
        <SectionHeader icon={Shield} title="Prerequisites" subtitle="Must be resolved before Phase 1 starts" accent={phase.accent} />
        <table className="compare">
          <thead>
            <tr><th>Item</th><th>Owner / Details</th><th>Blocks</th></tr>
          </thead>
          <tbody>
            {phase.prerequisites.map((p, i) => (
              <tr key={i}>
                <td style={{ color: T.text }}>{p.item}</td>
                <td style={{ color: T.textMute }}>{p.who}</td>
                <td><span className="pill pill-rust">{p.risk}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <SectionHeader icon={GitBranch} title="Key Decisions to Lock In" subtitle="Document these before writing any code" accent={phase.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {phase.keyDecisions.map((d, i) => (
            <div key={i} className="card-flat">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span className="mono" style={{ color: T.textMute, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{d.decision}</span>
                <span className="pill pill-gold">{d.choice}</span>
              </div>
              <p style={{ color: T.text, opacity: .82, fontSize: 13, lineHeight: 1.6 }}>{d.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Phase1Content({ phase }) {
  const toolTypeColor = (t) => (
    t === "Generation" ? "gold" :
    t === "Refinement" ? "terra" :
    t === "Async Mgmt" ? "steel" : "sage"
  );
  return (
    <>
      <div className="card">
        <SectionHeader icon={Package} title="Tool Catalog — All 9 Tools" subtitle="Implement stubs first, then wire real workflows" accent={phase.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {phase.tools.map((t, i) => (
            <div key={i} className="card-flat">
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                <code className="mono" style={{ fontSize: 12.5, color: T.gold, fontWeight: 600 }}>{t.name}</code>
                <span className={`pill pill-${toolTypeColor(t.type)}`}>{t.type}</span>
                {t.async && <span className="pill pill-terra">async</span>}
              </div>
              <p style={{ color: T.textMute, fontSize: 12.5, lineHeight: 1.55 }}>{t.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <SectionHeader icon={Terminal} title="Server Scaffold" subtitle="FastMCP + Azure AD auth wiring" accent={phase.accent} />
        <CodeBlock code={phase.codeSnippet} language="python" title="src/server.py" />
      </div>
    </>
  );
}

function Phase2Content({ phase }) {
  return (
    <div className="card">
      <SectionHeader icon={Cloud} title="Azure Infrastructure Spec" accent={phase.accent} />
      <table className="compare">
        <thead><tr><th>Resource</th><th>Tier</th><th>Purpose</th></tr></thead>
        <tbody>
          {phase.infra.map((r, i) => (
            <tr key={i}>
              <td style={{ color: T.text }}>{r.resource}</td>
              <td><span className="pill pill-steel">{r.tier}</span></td>
              <td style={{ color: T.textMute }}>{r.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Phase3Content({ phase }) {
  return (
    <>
      <div className="card">
        <SectionHeader icon={Info} title="Auth Mode — Critical Decision" accent={phase.accent} />
        <div className="alert alert-note">
          <AlertTriangle size={14} color={T.gold} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ color: T.gold, fontSize: 12.5, fontWeight: 500, marginBottom: 6, letterSpacing: "0.02em" }}>
              Use Dynamic Discovery, NOT Manual OAuth 2.0
            </p>
            <p style={{ color: T.text, opacity: .85, fontSize: 12.5, lineHeight: 1.6 }}>{phase.authNote}</p>
          </div>
        </div>
      </div>
      <div className="card">
        <SectionHeader icon={Layers} title="Conversation Topics" subtitle="6 topics to build in Copilot Studio" accent={phase.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {phase.topics.map((t, i) => (
            <div key={i} className="card-flat">
              <p style={{ color: T.text, fontSize: 13.5, fontWeight: 500, marginBottom: 6 }}>{t.name}</p>
              <p style={{ color: T.textMute, fontSize: 12, marginBottom: 8 }}>
                <span style={{ color: T.textDim, marginRight: 6 }}>Triggers:</span>{t.triggers}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
                {t.tools.split(" → ").map((tool, j, arr) => (
                  <span key={j} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <code className="mono" style={{
                      fontSize: 11, color: T.gold, background: T.ink,
                      border: `1px solid ${T.border}`, padding: "2px 7px", borderRadius: 3,
                    }}>{tool}</code>
                    {j < arr.length - 1 && <ArrowRight size={10} color={T.textDim} />}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Phase4Content({ phase }) {
  return (
    <>
      {phase.knownIssue && (
        <div className="alert alert-danger">
          <AlertTriangle size={16} color={T.rust} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ color: T.rust, fontSize: 12.5, fontWeight: 600, marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Known Bug — Act Immediately
            </p>
            <p style={{ color: T.text, opacity: .9, fontSize: 13, lineHeight: 1.6 }}>{phase.knownIssue}</p>
          </div>
        </div>
      )}
      <div className="card">
        <SectionHeader icon={Code2} title="Manifest Files" subtitle="declarativeAgent.json + ai-plugin.json" accent={phase.accent} />
        <CodeBlock code={phase.manifestSnippet} language="json" title="manifests" />
      </div>
      <div className="card">
        <SectionHeader icon={Layers} title="MCP App UI Cards" subtitle="Interactive Adaptive Cards rendered in M365 Copilot chat" accent={phase.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {phase.mcpAppCards.map((c, i) => (
            <div key={i} className="card-flat">
              <p style={{ color: T.text, fontSize: 13.5, fontWeight: 500, marginBottom: 6 }}>{c.card}</p>
              <p style={{ color: T.textMute, fontSize: 12.5, marginBottom: 8, lineHeight: 1.55 }}>{c.content}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {c.actions.split(" | ").map((a, j) => (
                  <span key={j} className="pill pill-gold">{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Phase5Content({ phase }) {
  return (
    <>
      <div className="card">
        <SectionHeader icon={Database} title="Writeback Tools" accent={phase.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {phase.writebackTools.map((t, i) => (
            <div key={i} className="card-flat">
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                <code className="mono" style={{ fontSize: 12.5, color: T.gold, fontWeight: 600 }}>{t.tool}</code>
                <span className="pill pill-sage">{t.target}</span>
              </div>
              <p style={{ color: T.textMute, fontSize: 12.5, lineHeight: 1.55 }}>{t.notes}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <SectionHeader icon={Lock} title="OBO Auth Chain" subtitle="5-hop identity propagation" accent={phase.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {phase.authChain.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span className="auth-step-num">{s.step}</span>
              <div>
                <p style={{ color: T.text, fontSize: 13, fontWeight: 500 }}>{s.label}</p>
                <p style={{ color: T.textMute, fontSize: 12, marginTop: 3, lineHeight: 1.55 }}>{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Phase6Content({ phase }) {
  return (
    <>
      <div className="card">
        <SectionHeader icon={BarChart3} title="Success Metrics" subtitle="All must be green for 2 consecutive weeks to exit" accent={phase.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {phase.metrics.map((m, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              padding: "10px 14px", border: `1px solid ${T.border}`, borderRadius: 3, background: T.bgSunken,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  className="pill mono"
                  style={{ color: CATEGORY[m.category], borderColor: `${CATEGORY[m.category]}55`, background: `${CATEGORY[m.category]}10` }}
                >
                  {m.category}
                </span>
                <span style={{ color: T.text, opacity: .9, fontSize: 13 }}>{m.metric}</span>
              </div>
              <span className="mono" style={{ color: T.gold, fontSize: 12.5, fontWeight: 500 }}>{m.target}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <SectionHeader icon={TestTube} title="Testing Pyramid" subtitle="Test coverage before pilot sign-off" accent={phase.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {phase.testingLayers.map((t, i) => (
            <div key={i} className="card-flat">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={{ color: T.text, fontSize: 13.5, fontWeight: 500 }}>{t.layer}</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span className="pill pill-gold">{t.count}</span>
                  <span className="pill pill-steel">{t.framework}</span>
                </div>
              </div>
              <p style={{ color: T.textMute, fontSize: 12.5, lineHeight: 1.55 }}>{t.scope}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Phase7Content({ phase }) {
  return (
    <>
      <div className="card">
        <SectionHeader icon={Users} title="Rollout Gates" subtitle="Hold at each gate if exit criteria not met" accent={phase.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {phase.rolloutGates.map((g, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 16px", border: `1px solid ${T.border}`, borderRadius: 4, background: T.bgSunken,
            }}>
              <div style={{ flexShrink: 0, textAlign: "center", minWidth: 80 }}>
                <p style={{ color: T.textMute, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>{g.gate}</p>
                <p className="display" style={{ color: T.gold, fontSize: 28, lineHeight: 1, marginTop: 4 }}>{g.users}</p>
                <p style={{ color: T.textDim, fontSize: 11, marginTop: 4 }}>users</p>
              </div>
              <div style={{ width: 1, alignSelf: "stretch", background: T.border }} />
              <p style={{ color: T.text, opacity: .88, fontSize: 13, lineHeight: 1.6 }}>{g.criteria}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <SectionHeader icon={Shield} title="Compliance Mapping" accent={phase.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {phase.compliance.map((c, i) => (
            <div key={i} className="card-flat">
              <span className="pill pill-gold">{c.framework}</span>
              <p style={{ color: T.text, opacity: .85, fontSize: 12.5, lineHeight: 1.6, marginTop: 8 }}>{c.controls}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Phase8Content({ phase }) {
  return (
    <>
      <div className="card">
        <SectionHeader icon={RefreshCw} title="Maintenance Cadence" accent={phase.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {phase.cadence.map((c, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "10px 14px", border: `1px solid ${T.border}`, borderRadius: 3, background: T.bgSunken,
            }}>
              <span className="pill pill-sage" style={{ minWidth: 76, justifyContent: "center" }}>{c.frequency}</span>
              <p style={{ color: T.text, opacity: .88, fontSize: 13, lineHeight: 1.6 }}>{c.activity}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <SectionHeader icon={AlertTriangle} title="Long-Term Watch-Outs" accent={T.terra} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {phase.futureChallenges.map((c, i) => (
            <div key={i} className="alert alert-info">
              <Info size={13} color={T.steel} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 3 }} />
              <p style={{ color: T.text, opacity: .88, fontSize: 12.5, lineHeight: 1.6 }}>{c}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PhaseSpecificContent({ phase, checkedSteps, onToggle }) {
  const contentMap = {
    0: <Phase0Content phase={phase} />,
    1: <Phase1Content phase={phase} />,
    2: <Phase2Content phase={phase} />,
    3: <Phase3Content phase={phase} />,
    4: <Phase4Content phase={phase} />,
    5: <Phase5Content phase={phase} />,
    6: <Phase6Content phase={phase} />,
    7: <Phase7Content phase={phase} />,
    8: <Phase8Content phase={phase} />,
  };
  const completed = Array.from(checkedSteps).filter((id) => id.startsWith(`${phase.id}.`)).length;
  const PhaseIcon = phase.icon;

  return (
    <div className="anim-fade" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Phase header */}
      <div style={{
        border: `1px solid ${T.border}`, borderRadius: 4, padding: 24,
        background: `linear-gradient(180deg, ${T.bgPanel} 0%, ${T.bg} 100%)`,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span className="mono" style={{ color: phase.accent, fontSize: 11, letterSpacing: "0.18em" }}>{phase.label}</span>
              <span className="pill">{phase.duration}</span>
            </div>
            <h2 className="display h2" style={{ color: T.text, marginBottom: 8 }}>{phase.name}</h2>
            <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, maxWidth: 640 }}>{phase.goal}</p>
          </div>
          <div style={{
            flexShrink: 0, padding: 12, border: `1px solid ${phase.accent}55`, borderRadius: 4,
            background: `${phase.accent}10`,
          }}>
            <PhaseIcon size={22} color={phase.accent} strokeWidth={1.5} />
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: T.textMute, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Steps completed</span>
            <span className="mono" style={{ color: T.gold, fontSize: 12 }}>{completed} / {phase.steps.length}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${(completed / phase.steps.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <PhaseSteps phase={phase} checkedSteps={checkedSteps} onToggle={onToggle} />
          <PhaseRisks phase={phase} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {contentMap[phase.id]}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Top-level tabs — Cost, Risk, Refs
// ───────────────────────────────────────────────────────────────────────────────
function CostTab() {
  return (
    <div className="anim-fade" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {[
          { label: "Cost per Generation",  value: "$0.057",  sub: "GPT-4o, 5 user stories" },
          { label: "Monthly Infrastructure",value: "~$4,850", sub: "100 users, 20 gen/day" },
          { label: "ROI",                  value: "~15×",    sub: "$720 value vs $48 cost / user" },
        ].map((s, i) => (
          <div key={i} className="card-flat" style={{ textAlign: "center" }}>
            <p style={{ color: T.textMute, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>{s.label}</p>
            <p className="display" style={{ color: T.gold, fontSize: 38, lineHeight: 1, marginTop: 10 }}>{s.value}</p>
            <p style={{ color: T.textDim, fontSize: 11.5, marginTop: 8 }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <SectionHeader icon={Cpu} title="Per-Generation Cost Breakdown" subtitle="GPT-4o pricing, 5 user stories with AC" accent={T.gold} />
        <table className="compare">
          <thead>
            <tr>
              <th>Component</th>
              <th style={{ textAlign: "right" }}>Tokens</th>
              <th style={{ textAlign: "right" }}>Cost (USD)</th>
            </tr>
          </thead>
          <tbody>
            {COST_DATA.perGeneration.map((r, i) => {
              const last = i === COST_DATA.perGeneration.length - 1;
              return (
                <tr key={i} style={last ? { background: T.bgPanel } : undefined}>
                  <td style={{ color: T.text, opacity: last ? 1 : .9, fontWeight: last ? 500 : 400 }}>{r.component}</td>
                  <td className="mono" style={{ color: T.textMute, textAlign: "right" }}>{r.tokens}</td>
                  <td className="mono" style={{ color: last ? T.gold : T.text, textAlign: "right", fontWeight: last ? 500 : 400 }}>{r.cost}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="card">
        <SectionHeader icon={TrendingUp} title="Monthly Infrastructure Cost" subtitle="100 active users, 20 generations/day, 22 working days" accent={T.gold} />
        <table className="compare">
          <tbody>
            {COST_DATA.infrastructure.map((r, i) => (
              <tr key={i}>
                <td style={{ color: T.text, opacity: .9 }}>{r.resource}</td>
                <td className="mono" style={{ color: T.gold, textAlign: "right" }}>{r.cost}</td>
              </tr>
            ))}
            <tr style={{ background: T.bgPanel }}>
              <td style={{ color: T.text, fontWeight: 500 }}>Total</td>
              <td className="mono" style={{ color: T.gold, textAlign: "right", fontWeight: 600 }}>~$4,850/month</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RiskTab() {
  const sorted = [...TOP_RISKS].sort((a, b) => b.score - a.score);
  return (
    <div className="anim-fade card">
      <SectionHeader icon={AlertTriangle} title="Risk Register" subtitle="Top 10 risks — sorted by risk score" accent={T.terra} />
      <table className="compare">
        <thead>
          <tr>
            <th>ID</th>
            <th>Risk</th>
            <th>Severity</th>
            <th>Prob</th>
            <th>Score</th>
            <th>Phase</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => {
            const sevColor = SEVERITY[r.severity];
            const scoreColor = r.score >= 12 ? T.rust : r.score >= 8 ? T.terra : T.textMute;
            return (
              <tr key={i}>
                <td className="mono" style={{ color: T.textDim, fontSize: 11.5 }}>{r.id}</td>
                <td style={{ color: T.text, opacity: .92, maxWidth: 340 }}>{r.risk}</td>
                <td>
                  <span
                    className="pill mono"
                    style={{ color: sevColor, borderColor: `${sevColor}55`, background: `${sevColor}10` }}
                  >
                    {r.severity}
                  </span>
                </td>
                <td className="mono" style={{ color: T.textMute }}>{r.prob}</td>
                <td className="mono" style={{ color: scoreColor, fontWeight: 600 }}>{r.score}</td>
                <td style={{ color: T.textMute, fontSize: 12 }}>{r.phase}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RefsTab() {
  const cats = [...new Set(REFS.map((r) => r.category))];
  return (
    <div className="anim-fade" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {cats.map((cat) => (
        <div key={cat} className="card">
          <SectionHeader icon={BookOpen} title={cat} accent={T.gold} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {REFS.filter((r) => r.category === cat).map((ref, i) => (
              <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" className="ref-link">
                <span>{ref.label}</span>
                <ExternalLink size={13} strokeWidth={1.5} style={{ flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Shell
// ───────────────────────────────────────────────────────────────────────────────
const TOP_TABS = ["Phases", "Cost Model", "Risk Register", "References"];

export default function SDLCCopilotMCPPlan() {
  const [activeTopTab, setActiveTopTab] = useState("Phases");
  const [selectedPhaseId, setSelectedPhaseId] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const selectedPhase = PHASES.find((p) => p.id === selectedPhaseId);

  const toggleStep = (stepId) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      next.has(stepId) ? next.delete(stepId) : next.add(stepId);
      return next;
    });
  };

  const totalSteps = PHASES.reduce((acc, p) => acc + p.steps.length, 0);
  const completedSteps = checkedSteps.size;

  return (
    <div className="mcp-root">
      <GlobalStyles />

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${T.border}`, padding: "32px 40px 0", background: T.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
            <div style={{ minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span className="mono" style={{ color: T.terra, fontSize: 10.5, letterSpacing: "0.24em", textTransform: "uppercase" }}>
                  SDLC Copilot
                </span>
                <ChevronRight size={10} color={T.textDim} />
                <span className="mono" style={{ color: T.textMute, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  MCP Integration
                </span>
              </div>
              <h1 className="display h1" style={{ marginBottom: 10 }}>
                M365 Copilot & Copilot Studio<br />
                <em style={{ color: T.gold }}>integration plan.</em>
              </h1>
              <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.6, maxWidth: 580 }}>
                MCP-first strategy · 8 phases · ~10 weeks to org-wide rollout. Every step gated by exit criteria,
                risk-scored, and tied to a measurable success metric.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <div style={{ textAlign: "center" }}>
                <p className="display" style={{ color: T.gold, fontSize: 32, lineHeight: 1 }}>{completedSteps}</p>
                <p style={{ color: T.textMute, fontSize: 10.5, letterSpacing: "0.14em", marginTop: 6, textTransform: "uppercase" }}>
                  of {totalSteps} steps
                </p>
              </div>
              <div style={{ width: 1, height: 36, background: T.border }} />
              <div style={{ textAlign: "center" }}>
                <p className="display" style={{ color: T.text, fontSize: 32, lineHeight: 1 }}>{PHASES.length}</p>
                <p style={{ color: T.textMute, fontSize: 10.5, letterSpacing: "0.14em", marginTop: 6, textTransform: "uppercase" }}>
                  phases
                </p>
              </div>
              <div style={{ width: 1, height: 36, background: T.border }} />
              <div style={{ textAlign: "center" }}>
                <p className="display" style={{ color: T.text, fontSize: 32, lineHeight: 1 }}>~10w</p>
                <p style={{ color: T.textMute, fontSize: 10.5, letterSpacing: "0.14em", marginTop: 6, textTransform: "uppercase" }}>
                  to rollout
                </p>
              </div>
            </div>
          </div>

          {/* Overall progress */}
          <div className="progress-track" style={{ marginTop: 24 }}>
            <div className="progress-fill" style={{ width: `${(completedSteps / totalSteps) * 100}%` }} />
          </div>

          {/* Top tabs */}
          <div style={{ marginTop: 20, borderBottom: `1px solid ${T.border}` }}>
            {TOP_TABS.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTopTab === tab ? "active" : ""}`}
                onClick={() => setActiveTopTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Body */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 40px 80px" }}>
        {activeTopTab === "Phases" ? (
          <div style={{ display: "grid", gridTemplateColumns: `${sidebarCollapsed ? "56px" : "240px"} minmax(0, 1fr)`, gap: 28, transition: "grid-template-columns .2s" }}>
            {/* Phase nav */}
            <aside style={{ position: "sticky", top: 24, alignSelf: "start", maxHeight: "calc(100vh - 48px)", overflowY: "auto" }} className="scroll-hide">
              <button
                onClick={() => setSidebarCollapsed((p) => !p)}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                style={{
                  width: "100%", display: "flex", justifyContent: "flex-end", padding: "4px 6px 12px",
                  background: "none", border: "none", color: T.textMute, cursor: "pointer",
                }}
              >
                {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </button>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {PHASES.map((phase) => {
                  const PhaseIcon = phase.icon;
                  const done = Array.from(checkedSteps).filter((id) => id.startsWith(`${phase.id}.`)).length;
                  const isActive = selectedPhaseId === phase.id;
                  return (
                    <button
                      key={phase.id}
                      onClick={() => setSelectedPhaseId(phase.id)}
                      className={`nav-phase ${isActive ? "active" : ""}`}
                    >
                      <PhaseIcon size={14} color={isActive ? T.gold : phase.accent} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
                      {!sidebarCollapsed && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="nav-phase-label">{phase.label}</p>
                          <p className="nav-phase-name">{phase.name}</p>
                        </div>
                      )}
                      {!sidebarCollapsed && done > 0 && (
                        <span className="mono" style={{ color: isActive ? T.gold : T.textDim, fontSize: 10.5, flexShrink: 0 }}>
                          {done}/{phase.steps.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Phase content */}
            <main style={{ minWidth: 0 }}>
              {selectedPhase && (
                <PhaseSpecificContent
                  phase={selectedPhase}
                  checkedSteps={checkedSteps}
                  onToggle={toggleStep}
                />
              )}
            </main>
          </div>
        ) : activeTopTab === "Cost Model" ? (
          <CostTab />
        ) : activeTopTab === "Risk Register" ? (
          <RiskTab />
        ) : (
          <RefsTab />
        )}
      </div>
    </div>
  );
}
