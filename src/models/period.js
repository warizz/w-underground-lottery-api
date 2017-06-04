const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema(
  {
    bets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet' }],
    createdBy: {
      type: String,
      required: true
    },
    endedAt: {
      type: Date,
      required: true
    },
    isOpen: {
      default: true,
      type: Boolean,
      required: true
    },
    result: {
      six: {
        type: String,
        validate: {
          validator: v => /^\d{6}$/.test(v),
          message: '{VALUE} must be ######'
        }
      },
      two: {
        type: String,
        validate: {
          validator: v => /^\d{2}$/.test(v),
          message: '{VALUE} must be ##'
        }
      },
      firstThree: {
        type: String,
        validate: {
          validator: v => /^\d{3}$/.test(v),
          message: '{VALUE} must be ###'
        }
      },
      secondThree: {
        type: String,
        validate: {
          validator: v => /^\d{3}$/.test(v),
          message: '{VALUE} must be ###'
        }
      },
      thirdThree: {
        type: String,
        validate: {
          validator: v => /^\d{3}$/.test(v),
          message: '{VALUE} must be ###'
        }
      },
      fourthThree: {
        type: String,
        validate: {
          validator: v => /^\d{3}$/.test(v),
          message: '{VALUE} must be ###'
        }
      }
    }
  },
  {
    timestamps: true
  }
);

PeriodSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Period', PeriodSchema);
