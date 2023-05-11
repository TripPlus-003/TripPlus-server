const mongoose = require('mongoose');
const planSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.ObjectId,
      required: [
        function () {
          return !this.productId;
        },
        '請填寫 projectId 或 productId'
      ]
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      reuqired: [
        function () {
          return !this.projectId;
        },
        '請填寫 projectId 或 productId'
      ]
    },
    title: {
      type: String,
      required: [true, '請輸入回饋方案名稱']
    },
    price: {
      type: Number,
      required: [true, '請輸入回饋方案價格']
    },
    content: {
      type: String,
      required: [true, '請輸入回饋方案内容']
    },
    isAllowMulti: {
      type: Number,
      default: 1
    },
    isDelete: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Plan = mongoose.model('plans', planSchema);
module.exports = Plan;
