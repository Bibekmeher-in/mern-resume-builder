import React from 'react';
import { buttonStyles, profileInfoStyles as styles } from '../assets/dummystyle';
import { AlertCircle } from 'react-feather';
import { VoiceInput as Input } from './VoiceInput';

const ProfileInfoForm = ({ profileData, updateSection, onNext }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateSection(name, value);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Profile Information</h2>
            <p className="text-gray-600 mb-8">
                Start with your basic information. This section is the first thing employers see.
            </p>

            <div className="space-y-6">
                <div>
                    <Input
                        label="Full Name *"
                        placeholder="e.g., Rakesh Sarkar"
                        value={profileData?.fullName || ''}
                        onChange={handleChange}
                        name="fullName"
                        required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your full name as you'd like it to appear on your resume
                    </p>
                </div>

                <div>
                    <Input
                        label="Designation *"
                        placeholder="e.g., Electrician"
                        value={profileData?.designation || ''}
                        onChange={handleChange}
                        name="designation"
                        required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Your current or desired job title
                    </p>
                </div>

                <div>
                    <Input
                        label="Professional Summary *"
                        placeholder="Brief overview of your professional background, key achievements, and career goals..."
                        value={profileData?.summary || ''}
                        onChange={handleChange}
                        name="summary"
                        textarea={true}
                        rows={4}
                        required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Write a compelling summary that highlights your key strengths and career objectives (150-200 words recommended)
                    </p>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="button"
                        onClick={onNext}
                        className={buttonStyles.next}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Validation message will be displayed by parent component */}
            <div className="p-4">
                {/* Error will be handled by parent */}
            </div>
        </div>

    );
};

export default ProfileInfoForm;