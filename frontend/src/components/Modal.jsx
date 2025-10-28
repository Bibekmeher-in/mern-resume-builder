import React from 'react'
import { modalStyles as styles } from '../assets/dummystyle'
import { X, Loader2, Check, Download } from 'lucide-react'

const Modal = ({
    children, isOpen, onClose, title, hideHeader, showActionBtn, actionBtnIcon = null,
    actionBtnText, onActionClick = () => { },
}) => {
    if (!isOpen) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                {!hideHeader && (
                    <div className={styles.header}>
                        <h3 className={styles.title}>
                            {title}
                        </h3>

                        {showActionBtn && (
                            <button className={styles.actionButton} onClick={onActionClick}>
                                <span className="flex items-center gap-2">
                                    {actionBtnIcon === "loading" ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : actionBtnIcon === "check" ? (
                                        <Check size={16} className="text-white" />
                                    ) : actionBtnIcon === "download" ? (
                                        <Download size={16} />
                                    ) : null}
                                    {actionBtnText}
                                </span>
                            </button>
                        )}
                    </div>
                )}

                <button type='button' className={styles.closeButton} onClick={onClose}>
                    <X size={20} />
                </button>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    )
}

export default Modal;