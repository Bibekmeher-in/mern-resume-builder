"use client";

import { VoiceInput as Input } from "./VoiceInput";
import { RatingInput } from "./ResumeSection"; 
import { Plus, Trash2 } from "lucide-react";
import {
    commonStyles,
    additionalInfoStyles,
    certificationInfoStyles,
    contactInfoStyles,
    educationDetailsStyles,
    profileInfoStyles,
    projectDetailStyles,
    skillsInfoStyles,
    workExperienceStyles
} from "../assets/dummystyle"; 

// AdditionalInfoForm Component
export const AdditionalInfoForm = ({ languages, interests, updateArrayItem, addArrayItem, removeArrayItem }) => {
    return (
        <div className={additionalInfoStyles.container}>
            <h2 className={additionalInfoStyles.heading}>Additional Information</h2>

            {/* Languages Section */}
            <div className="mb-10">
                <h3 className={additionalInfoStyles.sectionHeading}>
                    <div className={additionalInfoStyles.dotViolet}></div>
                    Languages
                </h3>
                <div className="space-y-6">
                    {languages?.map((lang, index) => (
                        <div key={index} className={additionalInfoStyles.languageItem}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <Input
                                    label="Language"
                                    placeholder="e.g. English"
                                    value={lang.name || ""}
                                    onChange={({ target }) => updateArrayItem("languages", index, "name", target.value)}
                                />
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-4">Proficiency</label>
                                    <RatingInput
                                        value={lang.progress || 0}
                                        total={5}
                                        color="#8b5cf6"
                                        bgColor="#e2e8f0"
                                        onChange={(value) => updateArrayItem("languages", index, "progress", value)}
                                    />
                                </div>
                            </div>
                            {languages.length > 1 && (
                                <button
                                    type="button"
                                    className={commonStyles.trashButton}
                                    onClick={() => removeArrayItem("languages", index)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className={`${commonStyles.addButtonBase} ${additionalInfoStyles.addButtonLanguage}`}
                        onClick={() => addArrayItem("languages", { name: "", progress: 0 })}
                    >
                        <Plus size={16} /> Add Language
                    </button>
                </div>
            </div>

            {/* Interests Section */}
            <div className="mb-6">
                <h3 className={additionalInfoStyles.sectionHeading}>
                    <div className={additionalInfoStyles.dotOrange}></div>
                    Interests
                </h3>
                <div className="space-y-4">
                    {interests?.map((interest, index) => (
                        <div key={index} className={additionalInfoStyles.interestItem}>
                            <Input
                                placeholder="e.g. Reading, Photography"
                                value={interest || ""}
                                onChange={({ target }) => updateArrayItem("interests", index, null, target.value)}
                            />
                            {interests.length > 1 && (
                                <button
                                    type="button"
                                    className={commonStyles.trashButton}
                                    onClick={() => removeArrayItem("interests", index)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className={`${commonStyles.addButtonBase} ${additionalInfoStyles.addButtonInterest}`}
                        onClick={() => addArrayItem("interests", "")}
                    >
                        <Plus size={16} /> Add Interest
                    </button>
                </div>
            </div>
        </div>
    );
};

// CertificationInfoForm Component
export const CertificationInfoForm = ({ certifications, updateArrayItem, addArrayItem, removeArrayItem }) => {
    return (
        <div className={certificationInfoStyles.container}>
            <h2 className={certificationInfoStyles.heading}>Certifications</h2>
            <div className="space-y-6 mb-6">
                {certifications.map((cert, index) => (
                    <div key={index} className={certificationInfoStyles.item}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Certificate Title"
                                placeholder="ITI ELECTRICIAN"
                                value={cert.title || ""}
                                onChange={({ target }) => updateArrayItem(index, "title", target.value)}
                            />

                            <Input
                                label="Issuer"
                                placeholder="NTPC/ BHEL/ etc."
                                value={cert.issuer || ""}
                                onChange={({ target }) => updateArrayItem(index, "issuer", target.value)}
                            />

                            <Input
                                label="Year"
                                placeholder="2025"
                                value={cert.year || ""}
                                onChange={({ target }) => updateArrayItem(index, "year", target.value)}
                            />
                        </div>

                        {certifications.length > 1 && (
                            <button
                                type="button"
                                className={commonStyles.trashButton}
                                onClick={() => removeArrayItem(index)}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    className={`${commonStyles.addButtonBase} ${certificationInfoStyles.addButton}`}
                    onClick={() =>
                        addArrayItem({
                            title: "",
                            issuer: "",
                            year: "",
                        })
                    }
                >
                    <Plus size={16} />
                    Add Certification
                </button>
            </div>
        </div>
    );
};

// ContactInfoForm Component
export const ContactInfoForm = ({ contactInfo, updateSection }) => {
    return (
        <div className={contactInfoStyles.container}>
            <h2 className={contactInfoStyles.heading}>Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <Input
                        label="Address"
                        placeholder="Short Address"
                        value={contactInfo.location || ""}
                        onChange={({ target }) => updateSection("location", target.value)}
                    />
                </div>

                <Input
                    label="Email"
                    placeholder="john@example.com"
                    type="email"
                    value={contactInfo.email || ""}
                    onChange={({ target }) => updateSection("email", target.value)}
                />

                <Input
                    label="Phone Number"
                    placeholder="+91 89844 63742"
                    type="tel" // Voice input disabled by type
                    value={contactInfo.phone || ""}
                    onChange={({ target }) => updateSection("phone", target.value)}
                />

                <Input
                    label="LinkedIn"
                    placeholder="https://linkedin.com/in/username"
                    disabledVoice={true} 
                    value={contactInfo.linkedin || ""}
                    onChange={({ target }) => updateSection("linkedin", target.value)}
                />

                <Input
                    label="GitHub"
                    placeholder="https://github.com/username"
                    disabledVoice={true} 
                    value={contactInfo.github || ""}
                    onChange={({ target }) => updateSection("github", target.value)}
                />

                <div className="md:col-span-2">
                    <Input
                        label="Portfolio / Website"
                        placeholder="https://yourwebsite.com"
                        disabledVoice={true} 
                        value={contactInfo.website || ""}
                        onChange={({ target }) => updateSection("website", target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

// EducationDetailsForm Component
export const EducationDetailsForm = ({ educationInfo, updateArrayItem, addArrayItem, removeArrayItem }) => {
    return (
        <div className={educationDetailsStyles.container}>
            <h2 className={educationDetailsStyles.heading}>Education</h2>
            <div className="space-y-6 mb-6">
                {educationInfo.map((education, index) => (
                    <div key={index} className={educationDetailsStyles.item}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Degree"
                                placeholder="Diploma"
                                value={education.degree || ""}
                                onChange={({ target }) => updateArrayItem(index, "degree", target.value)}
                            />

                            <Input
                                label="Institution"
                                placeholder="XYZ University"
                                value={education.institution || ""}
                                onChange={({ target }) => updateArrayItem(index, "institution", target.value)}
                            />

                            <Input
                                label="Start Date"
                                type="month" 
                                value={education.startDate || ""}
                                onChange={({ target }) => updateArrayItem(index, "startDate", target.value)}
                            />

                            <Input
                                label="End Date"
                                type="month" 
                                value={education.endDate || ""}
                                onChange={({ target }) => updateArrayItem(index, "endDate", target.value)}
                            />
                        </div>
                        {educationInfo.length > 1 && (
                            <button
                                type="button"
                                className={commonStyles.trashButton}
                                onClick={() => removeArrayItem(index)}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    className={`${commonStyles.addButtonBase} ${educationDetailsStyles.addButton}`}
                    onClick={() =>
                        addArrayItem({
                            degree: "",
                            institution: "",
                            startDate: "",
                            endDate: "",
                        })
                    }
                >
                    <Plus size={16} /> Add Education
                </button>
            </div>
        </div>
    );
};

// ProfileInfoForm Component
export const ProfileInfoForm = ({ profileData, updateSection }) => {
    return (
        <div className={profileInfoStyles.container}>
            <h2 className={profileInfoStyles.heading}>Personal Information</h2>

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Full Name"
                        placeholder="Rakesh Sarkar"
                        value={profileData.fullName || ""}
                        onChange={({ target }) => updateSection("fullName", target.value)}
                    />

                    <Input
                        label="Designation"
                        placeholder="Maintenace"
                        value={profileData.designation || ""}
                        onChange={({ target }) => updateSection("designation", target.value)}
                    />

                    <div className="md:col-span-2">
                        <Input
                            label="Summary"
                            placeholder="Short introduction about yourself"
                            value={profileData.summary || ""}
                            onChange={({ target }) => updateSection("summary", target.value)}
                            textarea={true} 
                            rows={4}
                            className={profileInfoStyles.textarea}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ProjectDetailForm Component
export const ProjectDetailForm = ({ projectInfo, updateArrayItem, addArrayItem, removeArrayItem }) => {
    return (
        <div className={projectDetailStyles.container}>
            <h2 className={projectDetailStyles.heading}>Projects</h2>
            <div className="space-y-6 mb-6">
                {projectInfo.map((project, index) => (
                    <div key={index} className={projectDetailStyles.item}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Input
                                    label="Project Title"
                                    placeholder="Portfolio Website"
                                    value={project.title || ""}
                                    onChange={({ target }) => updateArrayItem(index, "title", target.value)}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Input
                                    label="Description"
                                    placeholder="Short description about the project"
                                    value={project.description || ""}
                                    onChange={({ target }) => updateArrayItem(index, "description", target.value)}
                                    textarea={true} // Renders as textarea
                                    rows={3}
                                    className={projectDetailStyles.textarea}
                                />
                            </div>

                            <Input
                                label="GitHub Link"
                                placeholder="https://github.com/username/project"
                                value={project.github || ""}
                                onChange={({ target }) => updateArrayItem(index, "github", target.value)}
                            />

                            <Input
                                label="Live Demo URL"
                                placeholder="https://yourproject.live"
                                value={project.liveDemo || ""}
                                onChange={({ target }) => updateArrayItem(index, "liveDemo", target.value)}
                            />
                        </div>

                        {projectInfo.length > 1 && (
                            <button
                                type="button"
                                className={commonStyles.trashButton}
                                onClick={() => removeArrayItem(index)}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    className={`${commonStyles.addButtonBase} ${projectDetailStyles.addButton}`}
                    onClick={() =>
                        addArrayItem({
                            title: "",
                            description: "",
                            github: "",
                            liveDemo: "",
                        })
                    }
                >
                    <Plus size={16} />
                    Add Project
                </button>
            </div>
        </div>
    );
};

// SkillsInfoForm Component
export const SkillsInfoForm = ({ skillsInfo, updateArrayItem, addArrayItem, removeArrayItem }) => {
    return (
        <div className={skillsInfoStyles.container}>
            <h2 className={skillsInfoStyles.heading}>Skills</h2>
            <div className="space-y-6 mb-6">
                {skillsInfo.map((skill, index) => (
                    <div key={index} className={skillsInfoStyles.item}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Skill Name"
                                placeholder="Technical Skills"
                                value={skill.name || ""}
                                onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                            />

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">
                                    Proficiency ({skill.progress ? Math.round(skill.progress / 20) : 0}/5)
                                </label>
                                <div className="mt-2">
                                    <RatingInput
                                        value={skill.progress || 0}
                                        total={5}
                                        color="#f59e0b"
                                        bgColor="#e2e8f0"
                                        onChange={(newValue) => updateArrayItem(index, "progress", newValue)}
                                    />
                                </div>
                            </div>
                        </div>

                        {skillsInfo.length > 1 && (
                            <button
                                type="button"
                                className={commonStyles.trashButton}
                                onClick={() => removeArrayItem(index)}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    className={`${commonStyles.addButtonBase} ${skillsInfoStyles.addButton}`}
                    onClick={() =>
                        addArrayItem({
                            name: "",
                            progress: 0,
                        })
                    }
                >
                    <Plus size={16} /> Add Skill
                </button>
            </div>
        </div>
    );
};

// WorkExperienceForm Component
export const WorkExperienceForm = ({ workExperience, updateArrayItem, addArrayItem, removeArrayItem }) => {
    return (
        <div className={workExperienceStyles.container}>
            <h2 className={workExperienceStyles.heading}>Work Experience</h2>
            <div className="space-y-6 mb-6">
                {workExperience.map((experience, index) => (
                    <div key={index} className={workExperienceStyles.item}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Company"
                                placeholder="ABC Corp"
                                value={experience.company || ""}
                                onChange={({ target }) => updateArrayItem(index, "company", target.value)}
                            />

                            <Input
                                label="Role"
                                placeholder="Safety Complaince"
                                value={experience.role || ""}
                                onChange={({ target }) => updateArrayItem(index, "role", target.value)}
                            />

                            <Input
                                label="Start Date"
                                type="month" 
                                value={experience.startDate || ""}
                                onChange={({ target }) => updateArrayItem(index, "startDate", target.value)}
                            />

                            <Input
                                label="End Date"
                                type="month" 
                                value={experience.endDate || ""}
                                onChange={({ target }) => updateArrayItem(index, "endDate", target.value)}
                            />
                        </div>

                        <div className="mt-6">
                            <Input
                                label="Description"
                                placeholder="What did you do in this role?"
                                value={experience.description || ""}
                                onChange={({ target }) => updateArrayItem(index, "description", target.value)}
                                textarea={true} 
                                rows={3}
                                className={workExperienceStyles.textarea}
                            />
                        </div>

                        {workExperience.length > 1 && (
                            <button
                                type="button"
                                className={commonStyles.trashButton}
                                onClick={() => removeArrayItem(index)}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    className={`${commonStyles.addButtonBase} ${workExperienceStyles.addButton}`}
                    onClick={() =>
                        addArrayItem({
                            company: "",
                            role: "",
                            startDate: "",
                            endDate: "",
                            description: "",
                        })
                    }
                >
                    <Plus size={16} />
                    Add Work Experience
                </button>
            </div>
        </div>
    );
};