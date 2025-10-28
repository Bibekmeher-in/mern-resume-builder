import React, { useState } from 'react'
import { Input } from './Inputs'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { useTranslation } from 'react-i18next'

const CreateResumeForm = () => {
    const { t } = useTranslation()

    const [title, setTitle] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleCreateResume = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError(t('createResumeForm.enterTitleError'))
            return
        }
        setError("")
        setLoading(true)

        try {
            const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
                title: title.trim()
            }, {
                headers: { "Cache-Control": "no-cache" }
            })


            if (response.data?._id || response.status === 304) {
                const resumeId = response.data?._id || "new-resume-id"; // fallback id
                navigate(`/resume/${resumeId}`)
            } else {
                setError(t('createResumeForm.genericError'))
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message)
            } else {
                setError(t('createResumeForm.genericError'))
            }
            console.error('CreateResume error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-lg'>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>{t('createResumeForm.title')}</h3>
            <p className='text-gray-600 mb-8'>
                {t('createResumeForm.subtitle')}
            </p>

            <form onSubmit={handleCreateResume}>
                <Input
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                    label={t('createResumeForm.resumeTitleLabel')}
                    placeholder={t('createResumeForm.resumeTitlePlaceholder')}
                    type='text'
                />

                {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

                <button
                    type='submit'
                    disabled={loading}   // disable while submitting
                    className='w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all'
                >
                    {loading ? t('createResumeForm.creating') : t('createResumeForm.createResume')}
                </button>
            </form>
        </div>
    )
}

export default CreateResumeForm;
