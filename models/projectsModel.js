const mongoose = require('mongoose');
const projectSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    title: {
      type: String,
      required: [true, '請輸入專案名稱']
    },
    teamId: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    startTime: {
      type: Date,
      required: [true, '請輸入專案開始時間']
    },
    endTime: {
      type: Date,
      required: [true, '請輸入專案結束時間']
    },
    target: {
      type: Number,
      required: [true, '請輸入目標金額']
    },
    category: {
      type: Number,
      required: [true, '請選擇專案類型'],
      default: 1
    },
    sum: {
      type: Number,
      default: 0
    },
    sponsorCount: {
      type: Number,
      default: 0
    },
    keyVision: {
      type: String
    },
    video: {
      type: String
    },
    summary: {
      type: String
    },
    isShowTarget: {
      type: Number,
      default: 1
    },
    url: {
      type: String
    },
    isLimit: {
      type: Number,
      default: 0
    },
    seoDescription: {
      type: String,
      maxLength: 150
    },
    isAbled: {
      type: Number,
      default: 0
    },
    payment: {
      type: Number
    },
    isAllowInstallment: {
      type: Number
    },
    atmDeadline: {
      type: Number
    },
    csDeadline: {
      type: Number
    },
    content: {
      type: String
    },
    isCommercialized: {
      type: Number,
      default: 0
    },
    productId: {
      type: mongoose.Schema.ObjectId
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;