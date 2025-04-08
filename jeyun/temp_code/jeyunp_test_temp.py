  dff_2x:
    bbox:
    - [0, 0]
    - [9020, 2000]
    cellname: dff_2x
    libname: logic_generated
    masks:
      Metal1:
      - - [3485, 790]
        - [3485, 1210]
      - - [3485, 340]
        - [3485, 0]
      - - [3485, 1660]
        - [3485, 2000]
      - - [7175, 790]
        - [7175, 1210]
      - - [7175, 340]
        - [7175, 0]
      - - [7175, 1660]
        - [7175, 2000]
      Metal2:
      - - [0, 0]
        - [9020, 0]
      - - [0, 2000]
        - [9020, 2000]
      - - [410, 790]
        - [205, 790]
      - - [410, 1210]
        - [205, 1210]
      - - [1230, 790]
        - [1025, 790]
      - - [1230, 1210]
        - [1025, 1210]
      - - [2870, 790]
        - [3075, 790]
      - - [2665, 1210]
        - [2870, 1210]
      - - [2050, 1510]
        - [2665, 1510]
      - - [2050, 490]
        - [2665, 490]
      - - [3485, 1000]
        - [3895, 1000]
      - - [3895, 790]
        - [4305, 790]
      - - [3895, 1210]
        - [4305, 1210]
      - - [3895, 340]
        - [3485, 340]
      - - [3895, 1660]
        - [3485, 1660]
      - - [4920, 790]
        - [4715, 790]
      - - [4920, 1210]
        - [4715, 1210]
      - - [6560, 790]
        - [6765, 790]
      - - [6355, 1210]
        - [6560, 1210]
      - - [5740, 1660]
        - [6355, 1660]
      - - [5740, 340]
        - [6355, 340]
      - - [7175, 1000]
        - [7585, 1000]
      - - [7585, 790]
        - [7995, 790]
      - - [7585, 1210]
        - [7995, 1210]
      - - [7585, 340]
        - [7175, 340]
      - - [7585, 1510]
        - [7175, 1510]
      - - [8610, 790]
        - [8405, 790]
      - - [8610, 1210]
        - [8405, 1210]
      Metal3:
      - - [205, 790]
        - [205, 1210]
      - - [410, 490]
        - [410, 1510]
      - - [1025, 790]
        - [1025, 1210]
      - - [1230, 490]
        - [1230, 1510]
      - - [2050, 790]
        - [2050, 1210]
      - - [2870, 340]
        - [2870, 1660]
      - - [3075, 790]
        - [3075, 1210]
      - - [2665, 790]
        - [2665, 1210]
      - - [3485, 790]
        - [3485, 1210]
      - - [3895, 340]
        - [3895, 1660]
      - - [4100, 790]
        - [4100, 1210]
      - - [3690, 1210]
        - [3690, 790]
      - - [4715, 790]
        - [4715, 1210]
      - - [4920, 490]
        - [4920, 1510]
      - - [5740, 790]
        - [5740, 1210]
      - - [6560, 490]
        - [6560, 1510]
      - - [6765, 790]
        - [6765, 1210]
      - - [6355, 790]
        - [6355, 1210]
      - - [7175, 790]
        - [7175, 1210]
      - - [7585, 340]
        - [7585, 1510]
      - - [7790, 790]
        - [7790, 1210]
      - - [7380, 1210]
        - [7380, 790]
      - - [8405, 790]
        - [8405, 1210]
      - - [8610, 490]
        - [8610, 1660]
    pins:
      CLK:
        layer: [Metal3, pin]
        name: CLK
        netname: CLK
        termname: null
        xy:
        - [165, 790]
        - [245, 1210]
      I:
        layer: [Metal3, pin]
        name: I
        netname: I
        termname: null
        xy:
        - [2010, 790]
        - [2090, 1210]
      O:
        layer: [Metal3, pin]
        name: O
        netname: O
        termname: null
        xy:
        - [8570, 490]
        - [8650, 1660]
      'VDD:':
        layer: [Metal2, pin]
        name: 'VDD:'
        netname: 'VDD:'
        termname: null
        xy:
        - [0, 1880]
        - [9020, 2120]
      'VSS:':
        layer: [Metal2, pin]
        name: 'VSS:'
        netname: 'VSS:'
        termname: null
        xy:
        - [0, -120]
        - [9020, 120]
    subblocks:
      I0:
        cellname: tinv_2x
        libname: logic_generated
        name: I0
        pins:
          EN: {netname: ICLKB, termName: EN}
          ENB: {netname: ICLK, termName: ENB}
          I: {netname: I, termName: I}
          O: {netname: MEM1, termName: O}
          'VDD:': {netname: null, termName: 'VDD:'}
          'VSS:': {netname: null, termName: 'VSS:'}
        transform: R0
        xy: [1640, 0]
      I1:
        cellname: inv_2x
        libname: logic_generated
        name: I1
        pins:
          I: {netname: MEM1, termName: I}
          O: {netname: LATCH, termName: O}
          'VDD:': {netname: null, termName: 'VDD:'}
          'VSS:': {netname: null, termName: 'VSS:'}
        transform: R0
        xy: [4510, 0]
      I2:
        cellname: tinv_small_1x
        libname: logic_generated
        name: I2
        pins:
          EN: {netname: ICLK, termName: EN}
          ENB: {netname: ICLKB, termName: ENB}
          I: {netname: LATCH, termName: I}
          O: {netname: MEM1, termName: O}
          'VDD:': {netname: null, termName: 'VDD:'}
          'VSS:': {netname: null, termName: 'VSS:'}
        transform: R0
        xy: [3280, 0]
      I3:
        cellname: tinv_layvar_rtrackswap_2x
        libname: logic_generated
        name: I3
        pins:
          EN: {netname: ICLK, termName: EN}
          ENB: {netname: ICLKB, termName: ENB}
          I: {netname: LATCH, termName: I}
          O: {netname: MEM2, termName: O}
          'VDD:': {netname: null, termName: 'VDD:'}
          'VSS:': {netname: null, termName: 'VSS:'}
        transform: R0
        xy: [5330, 0]
      I4:
        cellname: inv_layvar_prtrackswap_2x
        libname: logic_generated
        name: I4
        pins:
          I: {netname: MEM2, termName: I}
          O: {netname: OUT, termName: O}
          'VDD:': {netname: null, termName: 'VDD:'}
          'VSS:': {netname: null, termName: 'VSS:'}
        transform: R0
        xy: [8200, 0]
      I5:
        cellname: tinv_small_layvar_prtrackswap_1x
        libname: logic_generated
        name: I5
        pins:
          EN: {netname: ICLKB, termName: EN}
          ENB: {netname: ICLK, termName: ENB}
          I: {netname: OUT, termName: I}
          O: {netname: MEM2, termName: O}
          'VDD:': {netname: null, termName: 'VDD:'}
          'VSS:': {netname: null, termName: 'VSS:'}
        transform: R0
        xy: [6970, 0]
      I6:
        cellname: inv_2x
        libname: logic_generated
        name: I6
        pins:
          I: {netname: CLK, termName: I}
          O: {netname: ICLKB, termName: O}
          'VDD:': {netname: null, termName: 'VDD:'}
          'VSS:': {netname: null, termName: 'VSS:'}
        transform: R0
        xy: [0, 0]
      I7:
        cellname: inv_2x
        libname: logic_generated
        name: I7
        pins:
          I: {netname: ICLKB, termName: I}
          O: {netname: ICLK, termName: O}
          'VDD:': {netname: null, termName: 'VDD:'}
          'VSS:': {netname: null, termName: 'VSS:'}
        transform: R0
        xy: [820, 0]