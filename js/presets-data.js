// Edzésnevek: Nova S Pro kézikönyv. Numerikus kiinduló minták: olanga/nova.
// Ezek nem a gyártó hitelesített teljes paraméteradatbázisa.
export const PRESETS=[
  {
    "code": "push(b)",
    "category": "basic",
    "english": "Push(B)",
    "hu": "Fonák nyesett tolás",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ]
      ],
      "2": [
        [
          1205,
          3257,
          50,
          -5,
          20,
          1
        ]
      ],
      "3": [
        [
          863,
          3599,
          50,
          -5,
          30,
          1
        ]
      ]
    }
  },
  {
    "code": "push(f)",
    "category": "basic",
    "english": "Push(F)",
    "hu": "Tenyeres nyesett tolás",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ]
      ],
      "2": [
        [
          1205,
          3257,
          50,
          5,
          20,
          1
        ]
      ],
      "3": [
        [
          863,
          3599,
          50,
          5,
          30,
          1
        ]
      ]
    }
  },
  {
    "code": "drive(b)",
    "category": "basic",
    "english": "Drive(B)",
    "hu": "Fonák kontra",
    "random": false,
    "levels": {
      "1": [
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          3545,
          2177,
          50,
          -5,
          50,
          1
        ]
      ],
      "3": [
        [
          3545,
          2177,
          50,
          -5,
          70,
          1
        ]
      ]
    }
  },
  {
    "code": "drive(f)",
    "category": "basic",
    "english": "Drive(F)",
    "hu": "Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          3545,
          2177,
          50,
          5,
          50,
          1
        ]
      ],
      "3": [
        [
          3545,
          2177,
          50,
          5,
          70,
          1
        ]
      ]
    }
  },
  {
    "code": "loop(b)",
    "category": "basic",
    "english": "Loop(B)",
    "hu": "Fonák pörgetés nyesettre",
    "random": false,
    "levels": {
      "1": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ]
      ],
      "2": [
        [
          1178,
          3914,
          50,
          -5,
          20,
          1
        ]
      ],
      "3": [
        [
          836,
          4256,
          50,
          -5,
          30,
          1
        ]
      ]
    }
  },
  {
    "code": "loop(f)",
    "category": "basic",
    "english": "Loop(F)",
    "hu": "Tenyeres pörgetés nyesettre",
    "random": false,
    "levels": {
      "1": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ]
      ],
      "2": [
        [
          1178,
          3914,
          50,
          5,
          20,
          1
        ]
      ],
      "3": [
        [
          836,
          4256,
          50,
          5,
          30,
          1
        ]
      ]
    }
  },
  {
    "code": "loop(b)-drive(b)",
    "category": "combined",
    "english": "Loop(B)-Drive(B)",
    "hu": "Fonák pörgetés nyesettre → Fonák kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "3": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "loop(f)-drive(f)",
    "category": "combined",
    "english": "Loop(F)-Drive(F)",
    "hu": "Tenyeres pörgetés nyesettre → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "3": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "drive(f)-drive(b)",
    "category": "combined",
    "english": "Drive(F)-Drive(B)",
    "hu": "Tenyeres kontra → Fonák kontra",
    "random": false,
    "levels": {
      "1": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "3": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "push(f)-drive(f)",
    "category": "combined",
    "english": "Push(F)-Drive(F)",
    "hu": "Tenyeres nyesett tolás → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "push(b)-loop(b)",
    "category": "combined",
    "english": "Push(B)-Loop(B)",
    "hu": "Fonák nyesett tolás → Fonák pörgetés nyesettre",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ]
      ]
    }
  },
  {
    "code": "loop(f)-drive(b)",
    "category": "combined",
    "english": "Loop(F)-Drive(B)",
    "hu": "Tenyeres pörgetés nyesettre → Fonák kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "3": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "push(f)-loop(b)",
    "category": "combined",
    "english": "Push(F)-Loop(B)",
    "hu": "Tenyeres nyesett tolás → Fonák pörgetés nyesettre",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ]
      ]
    }
  },
  {
    "code": "drive(f)-drive(f)",
    "category": "combined",
    "english": "Drive(F)-Drive(F)",
    "hu": "Tenyeres kontra → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          0,
          40,
          1
        ]
      ],
      "2": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          0,
          40,
          1
        ]
      ],
      "3": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          0,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "push(b)-loop(f)",
    "category": "combined",
    "english": "Push(B)-Loop(F)",
    "hu": "Fonák nyesett tolás → Tenyeres pörgetés nyesettre",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ]
      ]
    }
  },
  {
    "code": "push(f)-loop(f)",
    "category": "combined",
    "english": "Push(F)-Loop(F)",
    "hu": "Tenyeres nyesett tolás → Tenyeres pörgetés nyesettre",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ]
      ]
    }
  },
  {
    "code": "loop(f)-loop(f)",
    "category": "combined",
    "english": "Loop(F)-Loop(F)",
    "hu": "Tenyeres pörgetés nyesettre → Tenyeres pörgetés nyesettre",
    "random": false,
    "levels": {
      "1": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          0,
          10,
          1
        ]
      ],
      "2": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          0,
          10,
          1
        ]
      ],
      "3": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          0,
          10,
          1
        ]
      ]
    }
  },
  {
    "code": "loop(b)-drive(f)",
    "category": "combined",
    "english": "Loop(B)-Drive(F)",
    "hu": "Fonák pörgetés nyesettre → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "3": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "push(b)-loop(f)-drive(b)",
    "category": "complex",
    "english": "Push(B)-Loop(F)-Drive(B)",
    "hu": "Fonák nyesett tolás → Tenyeres pörgetés nyesettre → Fonák kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "push(f)-loop(b)-drive(f)",
    "category": "complex",
    "english": "Push(F)-Loop(B)-Drive(F)",
    "hu": "Tenyeres nyesett tolás → Fonák pörgetés nyesettre → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "loop(f)-drive(f)-drive(b)",
    "category": "complex",
    "english": "Loop(F)-Drive(F)-Drive(B)",
    "hu": "Tenyeres pörgetés nyesettre → Tenyeres kontra → Fonák kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "3": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "loop(b)-drive(f)-drive(b)",
    "category": "complex",
    "english": "Loop(B)-Drive(F)-Drive(B)",
    "hu": "Fonák pörgetés nyesettre → Tenyeres kontra → Fonák kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "3": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "drive(f)-drive(f)-drive(f)",
    "category": "complex",
    "english": "Drive(F)-Drive(F)-Drive(F)",
    "hu": "Tenyeres kontra → Tenyeres kontra → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          0,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          0,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "3": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          0,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "push(f)-loop(f)-drive(f)",
    "category": "complex",
    "english": "Push(F)-Loop(F)-Drive(F)",
    "hu": "Tenyeres nyesett tolás → Tenyeres pörgetés nyesettre → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "push(b)-loop(b)-drive(b)",
    "category": "complex",
    "english": "Push(B)-Loop(B)-Drive(B)",
    "hu": "Fonák nyesett tolás → Fonák pörgetés nyesettre → Fonák kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "push(f)-loop(b)-drive(b)",
    "category": "complex",
    "english": "Push(F)-Loop(B)-Drive(B)",
    "hu": "Tenyeres nyesett tolás → Fonák pörgetés nyesettre → Fonák kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "loop(f)-drive(b)-drive(f)",
    "category": "complex",
    "english": "Loop(F)-Drive(B)-Drive(F)",
    "hu": "Tenyeres pörgetés nyesettre → Fonák kontra → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "3": [
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "loop(b)-drive(b)-drive(f)",
    "category": "complex",
    "english": "Loop(B)-Drive(B)-Drive(F)",
    "hu": "Fonák pörgetés nyesettre → Fonák kontra → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "3": [
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "push(b)-loop(f)-drive(f)",
    "category": "complex",
    "english": "Push(B)-Loop(F)-Drive(F)",
    "hu": "Fonák nyesett tolás → Tenyeres pörgetés nyesettre → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "push(b)-loop(b)-drive(f)",
    "category": "complex",
    "english": "Push(B)-Loop(B)-Drive(F)",
    "hu": "Fonák nyesett tolás → Fonák pörgetés nyesettre → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          1520,
          3572,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "drive(b)-drive(f)-drive(f)",
    "category": "complex",
    "english": "Drive(B)-Drive(F)-Drive(F)",
    "hu": "Fonák kontra → Tenyeres kontra → Tenyeres kontra",
    "random": false,
    "levels": {
      "1": [
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "3": [
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "random-drive",
    "category": "complex",
    "english": "Random Drive",
    "hu": "Véletlen kontra – két oldal",
    "random": true,
    "levels": {
      "1": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "3": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "23-random-drive",
    "category": "complex",
    "english": "2/3 Court Random Drive",
    "hu": "Véletlen kontra – az asztal kétharmada",
    "random": true,
    "levels": {
      "1": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "2": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ],
      "3": [
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ]
      ]
    }
  },
  {
    "code": "all-random",
    "category": "complex",
    "english": "All Random",
    "hu": "Vegyes, véletlen labdák",
    "random": true,
    "levels": {
      "1": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "2": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ],
      "3": [
        [
          1547,
          2915,
          50,
          5,
          10,
          1
        ],
        [
          1547,
          2915,
          50,
          -5,
          10,
          1
        ],
        [
          3545,
          2177,
          50,
          5,
          40,
          1
        ],
        [
          3545,
          2177,
          50,
          -5,
          40,
          1
        ]
      ]
    }
  }
];
