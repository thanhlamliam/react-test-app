export const eHeader = [
  {
    header: "TERM_EDIT",
    key: "canEdit",
    width: 60,
  },
  {
    key: 'yyyy',
    header: 'TB_YEAR',
    width: 100,
  },
  {
    key: 'basePlan',
    header: 'TB_BASE_PLAN',
    children: [
      {
        key: 'basePlan.bau',
        header: 'TB_BAU',
      },
      {
        key: 'basePlan.rdc',
        header: 'TB_REDUCTION',
      },
      {
        key: 'basePlan.emsAftRdc',
        header: 'TB_EMISSION_AFTER_REDUCTION',
      },
      {
        key: 'basePlan.rdcCpmToBs',
        header: 'TB_REDUCTION_COMPARE',
      },
      {
        key: 'basePlan.rdcRt',
        header: 'TB_REDUCTION_RATE',
      },
    ]
  },
  {
    key: 'revisionPlan',
    header: 'TB_REVISION_PLAN',
    children: [
      {
        key: 'revisionPlan.bau',
        header: 'TB_BAU',
      },
      {
        key: 'revisionPlan.rdc',
        header: 'TB_REDUCTION',
      },
      {
        key: 'revisionPlan.emsAftRdc',
        header: 'TB_EMISSION_AFTER_REDUCTION',
      },
      {
        key: 'revisionPlan.rdcCpmToBs',
        header: 'TB_REDUCTION_COMPARE',
      },
      {
        key: 'revisionPlan.rdcRt',
        header: 'TB_REDUCTION_RATE',
      },
    ]
  },
  {
    key: 'difference',
    header: 'TB_DIFFERENCE',
    children: [
      {
        key: 'difference.bau',
        header: 'TB_BAU',
      },
      {
        key: 'difference.rdc',
        header: 'TB_REDUCTION',
      },
      {
        key: 'difference.emsAftRdc',
        header: 'TB_EMISSION_AFTER_REDUCTION',
      },
      {
        key: 'difference.rdcCpmToBs',
        header: 'TB_REDUCTION_COMPARE',
      },
      {
        key: 'difference.rdcRt',
        header: 'TB_REDUCTION_RATE',
      },
    ]
  },
]