import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { dashboardStyles as styles } from '../assets/dummystyle'
import { useNavigate } from 'react-router-dom'
import { LucideFilePlus, LucideTrash2 } from 'lucide-react'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { ResumeSummaryCard } from '../components/Cards'

import toast from 'react-hot-toast'
import moment from 'moment'
import CreateResumeForm from '../components/CreateResumeForm'
import Modal from '../components/Modal'
import SubscriptionCards from '../components/SubscriptionCards'
import { useTranslation } from 'react-i18next'


const Dashboard = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [openCreateModel, setOpenCreateModel] = useState(false)
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true)
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const resumethumbnailLink = '/path/to/default/image.png';

  const calculateCompletion = (resume) => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resume.profileInfo?.fullName) completedFields++;
    if (resume.profileInfo?.designation) completedFields++;
    if (resume.profileInfo?.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resume.contactInfo?.email) completedFields++;
    if (resume.contactInfo?.phone) completedFields++;

    // Work Experience
    resume.workExperience?.forEach(exp => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resume.education?.forEach(edu => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resume.skills?.forEach(skill => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resume.projects?.forEach(project => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resume.certifications?.forEach(cert => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resume.languages?.forEach(lang => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += (resume.interests?.length || 0);
    completedFields += (resume.interests?.filter(i => i?.trim() !== "")?.length || 0);

    return Math.round((completedFields / totalFields) * 100);
  };


  const fetchAllResumes = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL)
      console.log(response)
      const resumeWithCompletion = response.data.map(resume => ({
        ...resume,
        completion: calculateCompletion(resume)
      }))

      setAllResumes(resumeWithCompletion)
    }

    catch (error) {
      console.error('Error fetching resumes:', error)
      toast.error('Failed to load resumes.')
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllResumes();
  }, []);

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;

    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete))
      toast.success('Resume deleted successfully')
      fetchAllResumes()
    }

    catch (error) {
      console.error('Error deleting resume:', error)
      toast.error('failed to delete resume')
    }
    finally {
      setResumeToDelete(null)
      setShowDeleteConfirm(false)
    }
  }

  const handleDeleteClick = (id) => {
    setResumeToDelete(id);
    setShowDeleteConfirm(true);
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>

          <div>
            <h1 className={styles.headerTitle}>{t('dashboard.myDocuments')}</h1> {/* Changed title for blue-collar context */}
            <p className={styles.headerSubtitle}>
              {allResumes.length > 0 ? t('dashboard.documentsCount', { count: allResumes.length })
                : t('dashboard.startBuildingProfile')}
            </p>
          </div>

          <div className='flex gap-4'>
            <button className={styles.createButton}
              // FIX 2: Corrected setter function call
              onClick={() => setOpenCreateModel(true)}>
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                {t('dashboard.createNow')}
                <LucideFilePlus className='group-hover:translate-x-1 transition-transform' size={18} />
              </span>
            </button>
          </div>

        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && allResumes.length === 0 && (
          <div className={styles.emptyStateWrapper}>
            <div className={styles.emptyIconWrapper}>
              <LucideFilePlus size={32} className='text-violet-600' />
            </div>

            <h3 className={styles.emptyTitle}>{t('dashboard.noDocumentsYet')}</h3>
            <p className={styles.emptyText}>
              {t('dashboard.noDocumentsText')}
            </p>

            <button className={styles.createButton} onClick={() => setOpenCreateModel(true)}>
              <div className={styles.createButtonOverlay}>
              </div>
              <span className={styles.createButtonContent}>
                {t('dashboard.createFirstDocument')}
                <LucideFilePlus className='group-hover:translate-x-1 transition-transform' size={20} />
              </span>
            </button>
          </div>
        )}

        {/* GRID VIEW */}
        {!loading && allResumes.length > 0 && (
          <div className={styles.grid}>
            <div className={styles.newResumeCard} onClick={() => setOpenCreateModel(true)}>
              <div className={styles.newResumeIcon}>
                <LucideFilePlus size={32} className='text-white' />
              </div>
              <h3 className={styles.newResumeTitle}>{t('dashboard.createNewDocument')}</h3>
              <p className={styles.newResumeText}>{t('dashboard.startBuildingCareer')}</p>
            </div>

            {allResumes.map((resume) => (
              <ResumeSummaryCard key={resume._id} imgUrl={resumethumbnailLink}
                title={resume.title} createdAt={resume.createdAt} updatedAt={resume.updatedAt}
                onSelect={() => navigate(`/resume/${resume._id}`)}
                onDelete={() => handleDeleteClick(resume._id)}
                completion={resume.completion || 0}
                isPremium={resume.isPremium}
                isNew={moment().diff(moment(resume.createdAt), 'days') < 7} />
            ))}
          </div>
        )}
      </div>

      {/* SUBSCRIPTION CARDS SECTION */}
      <SubscriptionCards onGetStarted={() => navigate('/')} />

      {/* CREATE MODAL */}
      <Modal
        isOpen={openCreateModel}
        onClose={() => setOpenCreateModel(false)}
        hideHeader
        maxWidth="max-w-2xl"
      >
        <div className='p-6'>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>{t('dashboard.createNewDocument')}</h3>

            <button onClick={() => setOpenCreateModel(false)} className={styles.modalCloseButton}>
              x
            </button>
          </div>
          <CreateResumeForm onSuccess={() => {
            setOpenCreateModel(false);
            fetchAllResumes();
          }} />
        </div>
      </Modal>


      {/* DELETE MODAL*/}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title={t('dashboard.confirmDeletion')}
        showActionBtn actionBtnText={t('dashboard.delete')} actionBtnclassName='bg-red-600 hover:bg-red-700'
        onActionClick={handleDeleteResume}>
        <div className='p-4'>
          <div className='flex flex-col items-center text-center'>
            {/* FIX 1: LucideTrash2 is now imported */}
            <div className={styles.deleteIconWrapper}>
              <LucideTrash2 className='text-orange-600' size={24} />
            </div>
            <h3 className={styles.deleteTitle}>{t('dashboard.deleteDocument')}</h3>
            <p className={styles.deleteText}>
              {t('dashboard.deleteDocumentText')}
            </p>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default Dashboard;