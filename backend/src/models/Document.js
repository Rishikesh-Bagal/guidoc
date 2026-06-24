const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'FAQ question is required'],
    trim: true,
  },
  answer: {
    type: String,
    required: [true, 'FAQ answer is required'],
    trim: true,
  }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Document name is required'],
    trim: true,
    unique: true,
    index: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    index: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Identity', 'Vehicle', 'Income & Taxes', 'Property', 'Education', 'Health', 'Other'],
      message: '{VALUE} is not a valid category'
    },
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters']
  },
  eligibility: {
    type: [String],
    default: [],
    // Description of who can apply
  },
  requiredDocuments: {
    type: [String],
    default: [],
    // List of other documents needed
  },
  onlineSteps: {
    type: [String],
    default: [],
    // Step by step guide for online application
  },
  offlineSteps: {
    type: [String],
    default: [],
    // Step by step guide for offline application
  },
  fees: {
    type: String,
    default: 'Free',
    // Example: "₹500 for normal, ₹1000 for tatkal"
  },
  processingTime: {
    type: String,
    default: 'Varies',
    // Example: "10-15 working days"
  },
  faqs: {
    type: [faqSchema],
    default: []
  },
  officialWebsite: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 
      'Please enter a valid URL'
    ]
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true // Useful for filtering out inactive documents on the frontend
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Text index for smart search features later on
documentSchema.index({
  name: 'text',
  description: 'text',
  category: 'text'
}, {
  weights: {
    name: 10,
    category: 5,
    description: 1
  },
  name: 'DocumentTextIndex'
});

documentSchema.pre('validate', function() {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
