import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import DashboardLayout from './DashboardLayout'
import { buttonStyles, containerStyles, iconStyles, statusStyles } from '../assets/dummystyle'
import { TitleInput } from './Inputs'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import toast from 'react-hot-toast'
import { prepareForCanvas, cleanupCanvas } from '../utils/htmlToCanvas'
import { fixTailwindColors, convertElementColors } from '../utils/helper'
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Loader2, Palette, Save, Trash2 } from 'lucide-react'
import { AlertCircle, ArrowLeft, Check, Download } from 'react-feather'
import ProfileInfoForm from './ProfileInfoForm'
import StepProgress from './StepProgress'
import Modal from './Modal'
import RenderResume from './RenderResume'
import ThemeSelector from './ThemeSelector'
import { AdditionalInfoForm } from './Forms';
import { CertificationInfoForm } from './Forms';
import { ContactInfoForm } from './Forms';
import { EducationDetailsForm } from './Forms';
import { ProjectDetailForm } from './Forms';
import { SkillsInfoForm } from './Forms';
import { WorkExperienceForm } from './Forms';


// RESIZE OBSERVER HOOK
const useResizeObserver = () => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setSize({ width, height });
            }
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return { ...size, ref };
};

const dataURLtoFile = (dataUrl, filename) => {
    if (!dataUrl || !dataUrl.includes(',')) {
        throw new Error("Invalid data URL provided");
    }
    const arr = dataUrl.split(',')
    if (arr.length < 2) {
        throw new Error("Invalid data URL format");
    }
    const mimeMatch = arr[0].match(/:(.*?);/)
    if (!mimeMatch) {
        throw new Error("Invalid data URL mime type");
    }
    const mime = mimeMatch[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
}

const EditResume = () => {
    const { t } = useTranslation()
    const { resumeId } = useParams()
    const navigate = useNavigate()
    const resumeDownloadRef = useRef(null)
    const thumbnailRef = useRef(null)

    const [openThemeSelector, setOpenThemeSelector] = useState(false)
    const [openPreviewModal, setOpenPreviewModal] = useState(false)
    const [currentPage, setCurrentPage] = useState("profile-info")
    const [progress, setProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [completionPercentage, setCompletionPercentage] = useState(0)

    const { width: previewWidth, ref: previewContainerRef } = useResizeObserver();

    const [resumeData, setResumeData] = useState({
        title: "Professional Resume",
        thumbnailLink: "",
        profileInfo: {
            fullName: "",
            designation: "",
            summary: "",
        },
        template: {
            theme: "modern",
            colorPalette: []
        },
        contactInfo: {
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            github: "",
            website: "",
        },
        workExperience: [
            {
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                description: "",
            },
        ],
        education: [
            {
                degree: "",
                institution: "",
                startDate: "",
                endDate: "",
            },
        ],
        skills: [
            {
                name: "",
                progress: 0,
            },
        ],
        projects: [
            {
                title: "",
                description: "",
                github: "",
                liveDemo: "",
            },
        ],
        certifications: [
            {
                title: "",
                issuer: "",
                year: "",
            },
        ],
        languages: [
            {
                name: "",
                progress: 0,
            },
        ],
        interests: [""],
    })

    // Calculate completion percentage
    const calculateCompletion = () => {
        let completedFields = 0;
        let totalFields = 0;

        // Profile Info
        totalFields += 3;
        if (resumeData.profileInfo.fullName) completedFields++;
        if (resumeData.profileInfo.designation) completedFields++;
        if (resumeData.profileInfo.summary) completedFields++;

        // Contact Info
        totalFields += 2;
        if (resumeData.contactInfo.email) completedFields++;
        if (resumeData.contactInfo.phone) completedFields++;

        // Work Experience
        resumeData.workExperience.forEach(exp => {
            totalFields += 5;
            if (exp.company) completedFields++;
            if (exp.role) completedFields++;
            if (exp.startDate) completedFields++;
            if (exp.endDate) completedFields++;
            if (exp.description) completedFields++;
        });

        // Education
        resumeData.education.forEach(edu => {
            totalFields += 4;
            if (edu.degree) completedFields++;
            if (edu.institution) completedFields++;
            if (edu.startDate) completedFields++;
            if (edu.endDate) completedFields++;
        });

        // Skills
        resumeData.skills.forEach(skill => {
            totalFields += 2;
            if (skill.name) completedFields++;
            if (skill.progress > 0) completedFields++;
        });

        // Projects
        resumeData.projects.forEach(project => {
            totalFields += 4;
            if (project.title) completedFields++;
            if (project.description) completedFields++;
            if (project.github) completedFields++;
            if (project.liveDemo) completedFields++;
        });

        // Certifications
        resumeData.certifications.forEach(cert => {
            totalFields += 3;
            if (cert.title) completedFields++;
            if (cert.issuer) completedFields++;
            if (cert.year) completedFields++;
        });

        // Languages
        resumeData.languages.forEach(lang => {
            totalFields += 2;
            if (lang.name) completedFields++;
            if (lang.progress > 0) completedFields++;
        });

        // Interests
        totalFields += resumeData.interests.length;
        completedFields += resumeData.interests.filter(i => i.trim() !== "").length;

        const percentage = Math.round((completedFields / totalFields) * 100);
        setCompletionPercentage(percentage);
        return percentage;
    };

    useEffect(() => {
        calculateCompletion();
    }, [resumeData]);

    // Validate Inputs
    const validateAndNext = (e) => {
        const errors = []

        switch (currentPage) {
            case "profile-info":
                const { fullName, designation, summary } = resumeData.profileInfo
                if (!fullName.trim()) errors.push("Full Name is required")
                if (!designation.trim()) errors.push("Designation is required")
                if (!summary.trim()) errors.push("Summary is required")
                break

            case "contact-info":
                const { email, phone } = resumeData.contactInfo
                if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Valid email is required.")
                if (!phone.trim() || !/^\d{10}$/.test(phone)) errors.push("Valid 10-digit phone number is required")
                break

            case "work-experience":
                resumeData.workExperience.forEach(({ company, role, startDate, endDate }, index) => {
                    if (!company || !company.trim()) errors.push(`Company is required in experience ${index + 1}`)
                    if (!role || !role.trim()) errors.push(`Role is required in experience ${index + 1}`)
                    if (!startDate || !endDate) errors.push(`Start and End dates are required in experience ${index + 1}`)
                })
                break

            case "education-info":
                resumeData.education.forEach(({ degree, institution, startDate, endDate }, index) => {
                    if (!degree.trim()) errors.push(`Degree is required in education ${index + 1}`)
                    if (!institution.trim()) errors.push(`Institution is required in education ${index + 1}`)
                    if (!startDate || !endDate) errors.push(`Start and End dates are required in education ${index + 1}`)
                })
                break

            case "skills":
                resumeData.skills.forEach(({ name, progress }, index) => {
                    if (!name.trim()) errors.push(`Skill name is required in skill ${index + 1}`)
                    if (progress < 1 || progress > 100)
                        errors.push(`Skill progress must be between 1 and 100 in skill ${index + 1}`)
                })
                break

            case "projects":
                resumeData.projects.forEach(({ title, description }, index) => {
                    if (!title.trim()) errors.push(`Project Title is required in project ${index + 1}`)
                    if (!description.trim()) errors.push(`Project description is required in project ${index + 1}`)
                })
                break

            case "certifications":
                resumeData.certifications.forEach(({ title, issuer }, index) => {
                    if (!title.trim()) errors.push(`Certification Title is required in certification ${index + 1}`)
                    if (!issuer.trim()) errors.push(`Issuer is required in certification ${index + 1}`)
                })
                break

            case "additionalInfo":
                if (resumeData.languages.length === 0 || !resumeData.languages[0].name?.trim()) {
                    errors.push("At least one language is required")
                }
                if (resumeData.interests.length === 0 || !resumeData.interests[0]?.trim()) {
                    errors.push("At least one interest is required")
                }
                break

            default:
                break
        }

        if (errors.length > 0) {
            setErrorMsg(errors.join(", "))
            return
        }

        setErrorMsg("")
        goToNextStep()
    }

    const goToNextStep = () => {
        const pages = [
            "profile-info",
            "contact-info",
            "work-experience",
            "education-info",
            "skills",
            "projects",
            "certifications",
            "additionalInfo",
        ]

        if (currentPage === "additionalInfo") setOpenPreviewModal(true)

        const currentIndex = pages.indexOf(currentPage)
        if (currentIndex !== -1 && currentIndex < pages.length - 1) {
            const nextIndex = currentIndex + 1
            setCurrentPage(pages[nextIndex])

            const percent = Math.round((nextIndex / (pages.length - 1)) * 100)
            setProgress(percent)
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    //TAKE BACK TO PREVIOUS FORM STATE OR TAKE BACK TO FIRST OR /DASHBOARD
    const goBack = () => {
        const pages = [
            "profile-info",
            "contact-info",
            "work-experience",
            "education-info",
            "skills",
            "projects",
            "certifications",
            "additionalInfo",
        ]

        if (currentPage === "profile-info") navigate("/dashboard")

        const currentIndex = pages.indexOf(currentPage)
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1
            setCurrentPage(pages[prevIndex])

            const percent = Math.round((prevIndex / (pages.length - 1)) * 100)
            setProgress(percent)
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    const renderForm = () => {
        switch (currentPage) {
            case "profile-info":
                return (
                    <ProfileInfoForm
                        profileData={resumeData?.profileInfo}
                        updateSection={(key, value) => updateSection("profileInfo", key, value)}
                        onNext={validateAndNext}
                    />
                )

            case "contact-info":
                return (
                    <ContactInfoForm
                        contactInfo={resumeData?.contactInfo}
                        updateSection={(key, value) => updateSection("contactInfo", key, value)}
                    />
                )

            case "work-experience":
                return (
                    <WorkExperienceForm
                        workExperience={resumeData?.workExperience}
                        updateArrayItem={(index, key, value) => updateArrayItem("workExperience", index, key, value)}
                        addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
                        removeArrayItem={(index) => removeArrayItem("workExperience", index)}
                    />
                )

            case "education-info":
                return (
                    <EducationDetailsForm
                        educationInfo={resumeData?.education}
                        updateArrayItem={(index, key, value) => updateArrayItem("education", index, key, value)}
                        addArrayItem={(newItem) => addArrayItem("education", newItem)}
                        removeArrayItem={(index) => removeArrayItem("education", index)}
                    />
                )

            case "skills":
                return (
                    <SkillsInfoForm
                        skillsInfo={resumeData?.skills}
                        updateArrayItem={(index, key, value) => updateArrayItem("skills", index, key, value)}
                        addArrayItem={(newItem) => addArrayItem("skills", newItem)}
                        removeArrayItem={(index) => removeArrayItem("skills", index)}
                    />
                )

            case "projects":
                return (
                    <ProjectDetailForm
                        projectInfo={resumeData?.projects}
                        updateArrayItem={(index, key, value) => updateArrayItem("projects", index, key, value)}
                        addArrayItem={(newItem) => addArrayItem("projects", newItem)}
                        removeArrayItem={(index) => removeArrayItem("projects", index)}
                    />
                )

            case "certifications":
                return (
                    <CertificationInfoForm
                        certifications={resumeData?.certifications}
                        updateArrayItem={(index, key, value) => updateArrayItem("certifications", index, key, value)}
                        addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
                        removeArrayItem={(index) => removeArrayItem("certifications", index)}
                    />
                )

            case "additionalInfo":
                return (
                    <AdditionalInfoForm
                        languages={resumeData?.languages}
                        interests={resumeData?.interests}
                        updateArrayItem={(section, index, key, value) => updateArrayItem(section, index, key, value)}
                        addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
                        removeArrayItem={(section, index) => removeArrayItem(section, index)}
                    />
                )

            default:
                return null
        }
    }

    //UPDATE THE SECTION STATE

    const updateSection = (section, key, value) => {
        setResumeData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }))
    }

    //UPDATE ARRAY ITEMS STATE USING INDEX

    const updateArrayItem = (section, index, key, value) => {
        setResumeData((prev) => {
            const updatedArray = [...prev[section]]

            if (key === null) {
                updatedArray[index] = value
            } else {
                updatedArray[index] = {
                    ...updatedArray[index],
                    [key]: value,
                }
            }

            return {
                ...prev,
                [section]: updatedArray,
            }
        })
    }

    //ADDING NEW ITEMS i.e, INFORMATION

    const addArrayItem = (section, newItem) => {
        setResumeData((prev) => ({
            ...prev,
            [section]: [...prev[section], newItem],
        }))
    }

    //REMOVING THE INFO USING INDEX
    const removeArrayItem = (section, index) => {
        setResumeData((prev) => {
            const updatedArray = [...prev[section]]
            updatedArray.splice(index, 1)
            return {
                ...prev,
                [section]: updatedArray,
            }
        })
    }

    //FETCHING THE RESUME DETAILS USING BACKEND URL
    const fetchResumeDetailsById = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId))

            if (response.data && response.data.profileInfo) {
                const resumeInfo = response.data

                setResumeData((prevState) => ({
                    ...prevState,
                    title: resumeInfo?.title || "Untitled",
                    template: resumeInfo?.template || prevState?.template,
                    profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
                    contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
                    workExperience: resumeInfo?.workExperience || prevState?.workExperience,
                    education: resumeInfo?.education || prevState?.education,
                    skills: resumeInfo?.skills || prevState?.skills,
                    projects: resumeInfo?.projects || prevState?.projects,
                    certifications: resumeInfo?.certifications || prevState?.certifications,
                    languages: resumeInfo?.languages || prevState?.languages,
                    interests: resumeInfo?.interests || prevState?.interests,
                }))
            }
        } catch (error) {
            console.error("Error fetching resume:", error)
            toast.error("Failed to load resume data")
        }
    }

    //IT WILL HELP IN CHOOSING THE PREVIEW AS WELL AS HELPS IN DOWNLOADING THE RESUMES ALSO SAVE THE RESUME AS IMAGE
    const uploadResumeImages = async () => {
        const toastId = toast.loading("Saving resume...");
        try {
            setIsLoading(true);

            const thumbnailElement = thumbnailRef.current;
            if (!thumbnailElement) {
                throw new Error("Thumbnail element not found");
            }

            const processAndCapture = async (element) => {
                let container = null;
                try {
                    // Create a deep clone of the element
                    const { container: tempContainer, clone: processedElement } = prepareForCanvas(element);
                    container = tempContainer;

                    // Convert all colors to RGB
                    convertElementColors(processedElement);

                    // Wait for a frame to ensure styles are applied
                    await new Promise(resolve => requestAnimationFrame(resolve));

                    // Ensure all images are loaded
                    await Promise.all(
                        Array.from(processedElement.getElementsByTagName('img'))
                            .map(img => img.complete ? Promise.resolve() : new Promise(resolve => img.onload = resolve))
                    );

                    // Capture with html2canvas
                    const thumbnailCanvas = await html2canvas(processedElement, {
                        scale: 0.5,
                        backgroundColor: "#FFFFFF",
                        logging: false,
                        useCORS: true,
                        allowTaint: true,
                        removeContainer: false,
                        onclone: (clonedDoc) => {
                            // Convert remaining colors first, then fix Tailwind colors
                            convertElementColors(clonedDoc.documentElement);
                            fixTailwindColors(clonedDoc.documentElement);
                        }
                    });

                    // Cleanup the temporary container
                    if (container) {
                        cleanupCanvas(container);
                    }

                    return thumbnailCanvas;
                } catch (error) {
                    if (container) {
                        cleanupCanvas(container);
                    }
                    throw error;
                }
            };

            // Capture the thumbnail
            const thumbnailCanvas = await processAndCapture(thumbnailElement);

            // Create and upload the thumbnail
            const thumbnailDataUrl = thumbnailCanvas.toDataURL("image/png");
            if (!thumbnailDataUrl) {
                throw new Error("Failed to generate thumbnail data URL");
            }
            const thumbnailFile = dataURLtoFile(
                thumbnailDataUrl,
                `thumbnail-${resumeId}.png`
            );

            const formData = new FormData();
            formData.append("thumbnail", thumbnailFile);

            const uploadResponse = await axiosInstance.put(
                API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const { thumbnailLink } = uploadResponse.data;
            await updateResumeDetails(thumbnailLink);

            toast.success("Resume saved successfully", { id: toastId });
            navigate("/dashboard");
        } catch (error) {
            console.error("Error saving resume:", error);
            toast.error(error.message || "Failed to save resume", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }
    //THIS FUNCTION WILL HELP IN UPDATING THE RESUME AND PUT WILL HELP IN UPDATION ON BACKEND
    const updateResumeDetails = async (thumbnailLink) => {
        try {
            setIsLoading(true)

            await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), {
                ...resumeData,
                thumbnailLink: thumbnailLink || "",
                completion: completionPercentage,
            })
        } catch (err) {
            console.error("Error updating resume:", err)
            toast.error("Failed to update resume details")
        } finally {
            setIsLoading(false)
        }
    }

    //DELETE ANY FUNCTION TO DELETE ANY RESUME
    const handleDeleteResume = async () => {
        if (!resumeId) {
            toast.error("Invalid resume ID");
            return;
        }

        try {
            setIsLoading(true)
            await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId))
            toast.success("Resume deleted successfully")
            navigate("/dashboard")
        } catch (error) {
            console.error("Error deleting resume:", error)
            toast.error("Failed to delete resume")
        } finally {
            setIsLoading(false)
        }
    }



    //DOWNLOAD FUNCTION
    const downloadPDF = async () => {
        const element = resumeDownloadRef.current;
        if (!element) {
            toast.error("Failed to generate PDF. Please try again.");
            return;
        }

        setIsDownloading(true);
        setDownloadSuccess(false);
        const toastId = toast.loading("Generating PDF...");

        let clonedElement = null;
        try {
            // Create a deep clone of the element
            clonedElement = element.cloneNode(true);
            document.body.appendChild(clonedElement);
            convertElementColors(clonedElement);

            // Wait for images to load
            await Promise.all(
                Array.from(clonedElement.getElementsByTagName('img'))
                    .map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    }))
            );

            // Generate canvas using html2canvas
            const canvas = await html2canvas(clonedElement, {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                backgroundColor: '#FFFFFF',
                logging: false,
                onclone: (clonedDoc) => {
                    convertElementColors(clonedDoc.documentElement);
                    fixTailwindColors(clonedDoc.documentElement);
                }
            });

            // Create PDF using jsPDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${resumeData.title.replace(/[^a-z0-9]/gi, "_")}.pdf`);

            toast.success("PDF downloaded successfully!", { id: toastId });
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
        } catch (err) {
            console.error("PDF error:", err);
            toast.error(`Failed to generate PDF: ${err.message}`, { id: toastId });
        } finally {
            if (clonedElement && clonedElement.parentNode) {
                document.body.removeChild(clonedElement);
            }
            setIsDownloading(false);
        }
    };

    //THEME SELECTOR FUNCTION
    const updateTheme = (theme) => {
        if (!theme) {
            console.error('No theme provided to updateTheme');
            return;
        }
        setResumeData(prev => ({
            ...prev,
            template: {
                theme: theme,
                colorPalette: []
            }
        }));
        setOpenThemeSelector(false);
    }

    useEffect(() => {
        if (resumeId) {
            fetchResumeDetailsById()
        }
    }, [resumeId])

    //SO ALL THE FUNCTIONS WILL BE USED FOR EDIT RESUME.

    return (
        <DashboardLayout>
            <div className={containerStyles.main}>
                <div className={containerStyles.header}>
                    <TitleInput title={resumeData.title}
                        setTitle={(value) => setResumeData((prev) => ({
                            ...prev,
                            title: value,
                        }))}
                    />                    <div className='flex flex-wrap items-center gap-3'>
                        <button onClick={() => setOpenThemeSelector(true)} className={buttonStyles.theme}>
                            <span className="flex items-center gap-2">
                                <span className="text-current"><Palette size={16} /></span>
                                <span className='text-sm'>{t('Theme')}</span>
                            </span>
                        </button>

                        <button onClick={handleDeleteResume} className={buttonStyles.delete} disabled={isLoading}>
                            <span className="flex items-center gap-2">
                                <span className="text-current"><Trash2 size={16} /></span>
                                <span className='text-sm'>Delete</span>
                            </span>
                        </button>

                        <button onClick={() => setOpenPreviewModal(true)} className={buttonStyles.download}>
                            <span className="flex items-center gap-2">
                                <span className="text-current"><Download size={16} /></span>
                                <span className='text-sm'>Preview</span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* STEP PROGRESS */}

                <div className={containerStyles.grid}>
                    <div className={containerStyles.formContainer}>
                        <StepProgress progress={progress} />
                        {renderForm()}
                        <div className='p-4 sm:p-6'>
                            {errorMsg && (
                                <div className={statusStyles.error}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-current"><AlertCircle size={16} /></span>
                                        <p>{errorMsg}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center justify-end gap-3">
                                <button className={buttonStyles.back} onClick={goBack} disabled={isLoading}>
                                    <span className="flex items-center gap-2">
                                        <span className="text-current"><ArrowLeft size={16} /></span>
                                        <span>Back</span>
                                    </span>
                                </button>

                                <button className={buttonStyles.save} onClick={uploadResumeImages} disabled={isLoading}>
                                    <span className="flex items-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <span className="text-current"><Loader2 size={16} className='animate-spin' /></span>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-current"><Save size={16} /></span>
                                                <span>Save & Exit</span>
                                            </>
                                        )}
                                    </span>
                                </button>

                                <button className={buttonStyles.next} onClick={validateAndNext} disabled={isLoading}>
                                    <span className="flex items-center gap-2">
                                        {currentPage === "additionalInfo" && <span className="text-current"><Download size={16} /></span>}
                                        <span>{currentPage === "additionalInfo" ? "Preview & Download" : "Next"}</span>
                                        {currentPage === "additionalInfo" && <span className="text-current"><ArrowLeft size={16} className='rotate-180' /></span>}
                                    </span>
                                </button>

                            </div>

                        </div>

                    </div>
                    <div className='hidden lg:block'>
                        <div className={containerStyles.previewContainer}>
                            <div className="text-center mb-4">
                                <div className={statusStyles.completionBadge}>
                                    <div className={iconStyles.pulseDot}></div>
                                    <span>Preview - {completionPercentage}% Complete</span>
                                </div>

                            </div>
                            <div className='preview-container relative' ref={previewContainerRef}>
                                <div className={containerStyles.previewInner}>
                                    <RenderResume key={`preview-${resumeData?.template?.theme}`}
                                        templateId={resumeData?.template?.theme || ""}
                                        resumeData={resumeData}
                                        containerWidth={previewWidth}
                                    />
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* MODEL DATA HERE */}
            <Modal isOpen={openThemeSelector} onClose={() => setOpenThemeSelector(false)}
                title="Change Title">
                <div className={containerStyles.modalContent}>
                    <ThemeSelector selectedTheme={resumeData?.template.theme}
                        setSelectedTheme={updateTheme} onClose={() => setOpenThemeSelector(false)}
                        resumeData={resumeData}
                    />
                </div>
            </Modal>

            <Modal
                isOpen={openPreviewModal}
                onClose={() => setOpenPreviewModal(false)}
                title={resumeData.title}
                showActionBtn
                actionBtnText={isDownloading ? "Generating..." : downloadSuccess ? "Downloaded!" : "Download PDF"}
                actionBtnIcon={isDownloading ? "loading" : downloadSuccess ? "check" : "download"}
                onActionClick={downloadPDF}
            >
                <div className='relative'>
                    <div className='text-center mb-4'>
                        <div className={statusStyles.modalBadge}>
                            <div className={iconStyles.pulseDot}></div>
                            <span>Completion: {completionPercentage}%</span>
                        </div>
                    </div>

                    <div className={containerStyles.pdfPreview}>
                        <div ref={resumeDownloadRef} className='a4-wrapper'>
                            <div className='w-full h-full'>
                                <RenderResume key={`pdf.${resumeData?.template?.theme}`}
                                    templateId={resumeData?.template?.theme || ""}
                                    resumeData={resumeData}
                                    containerWidth={null}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>


            <div style={{ display: 'none' }} ref={thumbnailRef}>
                <div className={containerStyles.hiddenThumbnail}>
                    <RenderResume key={`thumb-${resumeData?.template?.theme}`}
                        templateId={resumeData?.template?.theme || ""}
                        resumeData={resumeData}
                    />

                </div>

            </div>
        </DashboardLayout>
    )
}

export default EditResume;