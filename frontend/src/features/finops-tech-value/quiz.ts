// correct = index into the lesson's mustKnow (the answer text is the fact verbatim).
// trap = the lesson's exam trap rephrased as a belief; wrong = two authored distractors.
// why = explanations in order [correct, trap, wrong[0], wrong[1]].
export type QuizSpec = {
  correct: number;
  trap: string;
  wrong: [string, string];
  why: [string, string, string, string];
};

export const QUIZ: Record<string, QuizSpec> = {
  "0.1": {
    correct: 0,
    trap: `FinOps is mainly about managing and reducing the public cloud bill.`,
    wrong: [
      `The Framework's Technology Category pages cover only Public Cloud and SaaS.`,
      `The 2026 definition limits FinOps to engineering teams' infrastructure spend.`,
    ],
    why: [
      `Correct: the 2026 definition centres on technology's business value.`,
      `Exam trap: FinOps now covers all technology spend, not just cloud-bill management.`,
      `Wrong: the lesson lists five categories: Public Cloud, SaaS, Data Center, Data Cloud Platforms and AI.`,
      `Wrong: the definition is about the business value of technology, not one team's infrastructure.`,
    ],
  },
  "0.2": {
    correct: 1,
    trap: `The exam rewards memorising the definitions taught in each module.`,
    wrong: [
      `The exam unlocks as soon as any two modules are badged.`,
      `The credential is valid for 12 months and allows unlimited attempts.`,
    ],
    why: [
      `Correct: it is cumulative and scenario-based, using multi-variable business cases.`,
      `Exam trap: the questions test judgement in business scenarios, not definitions.`,
      `Wrong: the exam unlocks only once all five modules are badged.`,
      `Wrong: there are up to 3 attempts within the 12-month access period, and the credential is valid 24 months.`,
    ],
  },
  "1.1": {
    correct: 0,
    trap: `A Scope is the same thing as a technology category or a billing account.`,
    wrong: [
      `Scopes are permanent and are not allowed to overlap.`,
      `A Scope starts from a vendor contract rather than a business question.`,
    ],
    why: [
      `Correct: the Category is the what; the Scope is the why.`,
      `Exam trap: a Scope is tied to a business construct, not a category or billing account.`,
      `Wrong: Scopes can overlap and are scaled back once they have served their purpose.`,
      `Wrong: Scopes start from business questions, not vendors.`,
    ],
  },
  "1.2": {
    correct: 1,
    trap: `A Scope is still useful when it has no accountable owner or budget line.`,
    wrong: [
      `Scopes replace budget hierarchies, so named owners are no longer needed.`,
      `The 2026 Framework treats Scopes as a reporting format only.`,
    ],
    why: [
      `Correct: Scopes are the practical mechanism for translating strategy into FinOps activities.`,
      `Exam trap: Scopes need an accountable owner and a budget line.`,
      `Wrong: accountability is assigned through budget hierarchies, not instead of them.`,
      `Wrong: the Framework treats Scopes as the mechanism for translating strategy into activity, not just reporting.`,
    ],
  },
  "1.3": {
    correct: 1,
    trap: `Executive Strategy Alignment means reporting last month's spend to executives.`,
    wrong: [
      `It sits in the Understand Usage & Cost domain.`,
      `It is a long-standing capability limited to annual budgeting.`,
    ],
    why: [
      `Correct: it sits in the Manage the FinOps Practice domain.`,
      `Exam trap: it covers investment strategy and decision rights, not only reporting.`,
      `Wrong: it belongs to Manage the FinOps Practice.`,
      `Wrong: it is a new 2026 capability covering multi-year investment strategy, not just annual budgeting.`,
    ],
  },
  "2.1": {
    correct: 1,
    trap: `Start with chargeback so teams feel the cost, and fix the allocation data later.`,
    wrong: [
      `Allocation coverage is the percentage of spend that has been optimised.`,
      `Tagging governance matters little once an account hierarchy exists.`,
    ],
    why: [
      `Correct: showback comes before chargeback.`,
      `Exam trap: chargeback should wait until the allocation data is trusted.`,
      `Wrong: allocation coverage is the % of spend with an owner.`,
      `Wrong: tagging governance and the account hierarchy both drive allocation.`,
    ],
  },
  "2.2": {
    correct: 3,
    trap: `Size commitments to peak usage so no demand is left uncovered.`,
    wrong: [
      `A commitment pays off at any utilisation as long as a discount is offered.`,
      `Coverage should be tracked, but utilisation does not need monitoring.`,
    ],
    why: [
      `Correct: the break-even condition is expected utilisation > (1 − discount).`,
      `Exam trap: commit to the stable baseline, not the peak or workloads due to be migrated or retired.`,
      `Wrong: below the break-even utilisation the commitment costs more than on demand.`,
      `Wrong: the lesson says to track both coverage and utilisation.`,
    ],
  },
  "2.3": {
    correct: 0,
    trap: `Buy commitments first; waste can be cleaned up afterwards.`,
    wrong: [
      `Usage optimisation mainly means negotiating a lower unit price.`,
      `The capability is still called Workload Optimization.`,
    ],
    why: [
      `Correct: those are the main usage-optimisation levers.`,
      `Exam trap: committing before cleaning up waste locks the waste in.`,
      `Wrong: lowering unit price is rate optimisation; usage optimisation uses fewer resources.`,
      `Wrong: it was renamed Usage Optimization (formerly Workload Optimization) in 2026.`,
    ],
  },
  "3.1": {
    correct: 1,
    trap: `Central procurement records already show all of the SaaS spend.`,
    wrong: [
      `Visibility work should wait until renewal negotiations are finished.`,
      `Procurement and software asset management are not relevant partners.`,
    ],
    why: [
      `Correct: expense claims, procurement records, SSO logs and finance ledgers are the discovery sources.`,
      `Exam trap: SaaS is often bought outside IT and central procurement, so records alone miss spend.`,
      `Wrong: visibility comes before negotiation.`,
      `Wrong: procurement and software asset management are key partners.`,
    ],
  },
  "3.2": {
    correct: 0,
    trap: `Cut licences straight away to bank the saving, without usage data or owner sign-off.`,
    wrong: [
      `Give everyone the highest licence tier to avoid feature gaps.`,
      `Keep overlapping tools so teams retain their choice.`,
    ],
    why: [
      `Correct: reclaim seats inactive for a defined period, such as 90 days.`,
      `Exam trap: cuts need usage data and owner sign-off.`,
      `Wrong: licence tiers should be right-sized to the features actually used.`,
      `Wrong: the lesson says to consolidate overlapping tools.`,
    ],
  },
  "3.3": {
    correct: 2,
    trap: `Let contracts auto-renew at the same seat count to avoid disruption.`,
    wrong: [
      `Begin renewal reviews only after the notice period has passed.`,
      `Use last year's purchase order as the negotiation baseline.`,
    ],
    why: [
      `Correct: watch for auto-renewal clauses and price escalators.`,
      `Exam trap: auto-renewing at the same seat count forgoes right-sizing.`,
      `Wrong: reviews should start well before notice periods.`,
      `Wrong: negotiate with usage data, not last year's purchase order.`,
    ],
  },
  "4.1": {
    correct: 2,
    trap: `Compare cloud monthly cost with on-prem hardware cost only.`,
    wrong: [
      `Straight-line cost is the purchase cost divided by useful life, ignoring residual value.`,
      `Facility overhead belongs outside the data centre cost model.`,
    ],
    why: [
      `Correct: straight-line is (cost − residual) ÷ useful life.`,
      `Exam trap: facility and staff costs must be included in the comparison.`,
      `Wrong: the residual value is subtracted before dividing by useful life.`,
      `Wrong: the model includes power, cooling, space, support contracts and staff.`,
    ],
  },
  "4.2": {
    correct: 1,
    trap: `Fully depreciated hardware is free to run.`,
    wrong: [
      `Refresh hardware on a fixed cycle regardless of migration plans.`,
      `Plan capacity with zero headroom so nothing is stranded.`,
    ],
    why: [
      `Correct: spent hardware money is sunk; decide on future costs only.`,
      `Exam trap: power, space, support and risk still cost money after depreciation.`,
      `Wrong: align the refresh cycle with migration plans.`,
      `Wrong: plan with enough headroom while avoiding stranded capacity.`,
    ],
  },
  "4.3": {
    correct: 0,
    trap: `Place each workload wherever the unit price is lowest.`,
    wrong: [
      `Regulation, latency and data residency should be ignored in placement decisions.`,
      `Architecting & Workload Placement was renamed from Usage Optimization.`,
    ],
    why: [
      `Correct: compare like-for-like TCO, including migration cost.`,
      `Exam trap: unit price alone ignores total cost and constraints.`,
      `Wrong: they are valid constraints.`,
      `Wrong: it was formerly Architecting for Cloud.`,
    ],
  },
  "5.1": {
    correct: 1,
    trap: `Manage data platforms the way you manage fixed-price licences.`,
    wrong: [
      `Data platform cost is driven only by the volume of data stored.`,
      `Query design has little effect on the credits consumed.`,
    ],
    why: [
      `Correct: cost = credits consumed × price per credit; credits depend on compute size and runtime.`,
      `Exam trap: consumption billing means cost follows query and compute behaviour.`,
      `Wrong: cost follows credits, which depend on compute size and runtime.`,
      `Wrong: poorly designed queries and always-on compute drive cost.`,
    ],
  },
  "5.2": {
    correct: 1,
    trap: `Attribute data platform cost by headcount rather than by query usage.`,
    wrong: [
      `Full scans are an efficient design for reused results.`,
      `Attribution should stay at company level rather than by department.`,
    ],
    why: [
      `Correct: those are the typical credit controls.`,
      `Exam trap: attribute by query usage, not headcount.`,
      `Wrong: efficient design avoids full scans and materialises reused results.`,
      `Wrong: the module covers department-level query attribution.`,
    ],
  },
  "6.1": {
    correct: 0,
    trap: `ITAM/SAM and ITFM compete with FinOps for the same remit.`,
    wrong: [
      `Intersecting Disciplines is a capability for keeping FinOps data separate from other teams.`,
      `The allied disciplines are limited to Procurement and Legal.`,
    ],
    why: [
      `Correct: that is the lesson's list of allied disciplines.`,
      `Exam trap: they are partners, not competitors.`,
      `Wrong: the capability coordinates shared data, governance and a common TCO/ROI view.`,
      `Wrong: the list covers ITAM/SAM, ITFM, Sustainability, Security and Enterprise Architecture.`,
    ],
  },
  "6.2": {
    correct: 0,
    trap: `FOCUS applies only to public cloud billing data.`,
    wrong: [
      `FOCUS stands for FinOps Optimised Commitment and Usage Standard.`,
      `Each category should keep its own billing format for accurate reporting.`,
    ],
    why: [
      `Correct: FOCUS is the FinOps Open Cost and Usage Specification.`,
      `Exam trap: Technology Categories are unified through FOCUS.`,
      `Wrong: the name is FinOps Open Cost and Usage Specification.`,
      `Wrong: a common format is what enables cross-category allocation, reporting and unit economics.`,
    ],
  },
  "6.3": {
    correct: 0,
    trap: `Report per-category savings; linking them to business outcomes is optional.`,
    wrong: [
      `Unit cost is the monthly cloud invoice divided by the number of engineers.`,
      `Present a single-point TCO/ROI figure without stating assumptions.`,
    ],
    why: [
      `Correct: divide fully loaded Scope cost by a business driver leadership already tracks.`,
      `Exam trap: savings need a link to business outcomes.`,
      `Wrong: the denominator is a business driver, not headcount, and the numerator is the fully loaded Scope cost.`,
      `Wrong: use TCO and ROI with stated assumptions and ranges.`,
    ],
  },
};
