import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    thumbnailLink: {
        type: String,
        required: false,
        default: '' // ✅ fixed
    },
    template: {
        theme: String,
        colorPalette: [String],
    },

    profileInfo: {
        profilePreviewUrl: String,
        fullName: String,
        designation: String,
        summary: String,
    },

    contactInfo: {
        email: String,
        phone: String,
        location: String,
        linkedIn: String,
        github: String,
        website: String,
    },

    workExperience: [
        {
            company: String,
            role: String,
            startDate: Date,
            endDate: Date,
            description: String,
        },
    ],

    education: [
        {
            institution: String,
            degree: String,
            startDate: Date,
            endDate: Date,
        },
    ],

    skills: [
        {
            name: String,
            progress: Number,
        },
    ],

    projects: [
        {
            name: String,
            description: String,
            githubLink: String,
            livedemoLink: String,
        },
    ],

    certifications: [
        {
            title: String,
            issuer: String,
            year: String,
        },
    ],

    languages: [
        {
            name: String,
            progress: Number,
        },
    ],

    interests: [String],

}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

export default mongoose.model('Resume', ResumeSchema);
