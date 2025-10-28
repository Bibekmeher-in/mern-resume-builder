import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star, Zap, Crown } from 'lucide-react';

const SubscriptionCards = ({ onGetStarted }) => {
    const { t } = useTranslation();

    const cards = [
        {
            title: t('freePlan'),
            price: t('free'),
            description: t('freeDesc'),
            features: [
                t('freeFeature1'),
                t('freeFeature2'),
                t('freeFeature3'),
                t('freeFeature4')
            ],
            buttonText: t('getStarted'),
            icon: <Zap className="w-8 h-8" />,
            gradient: 'from-violet-50 to-purple-50',
            iconBg: 'from-violet-500 to-purple-600',
            buttonGradient: 'from-violet-600 to-fuchsia-600',
            popular: false
        },
        {
            title: t('upgradePlan'),
            price: '$9.99/month',
            description: t('upgradeDesc'),
            features: [
                t('upgradeFeature1'),
                t('upgradeFeature2'),
                t('upgradeFeature3'),
                t('upgradeFeature4'),
                t('upgradeFeature5')
            ],
            buttonText: t('upgradeNow'),
            icon: <Star className="w-8 h-8" />,
            gradient: 'from-fuchsia-50 to-pink-50',
            iconBg: 'from-fuchsia-500 to-pink-600',
            buttonGradient: 'from-fuchsia-600 to-orange-500',
            popular: true
        },
        {
            title: t('masterPlan'),
            price: '$19.99/month',
            description: t('masterDesc'),
            features: [
                t('masterFeature1'),
                t('masterFeature2'),
                t('masterFeature3'),
                t('masterFeature4'),
                t('masterFeature5'),
                t('masterFeature6')
            ],
            buttonText: t('goPremium'),
            icon: <Crown className="w-8 h-8" />,
            gradient: 'from-orange-50 to-red-50',
            iconBg: 'from-orange-500 to-red-600',
            buttonGradient: 'from-orange-600 to-red-500',
            popular: false
        }
    ];

    return (
        <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-50 via-white to-violet-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-20">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6">
                        {t('chooseYourPlan')}
                        <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                            {' '}{t('perfectPlan')}
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                        {t('planDescription')}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={`relative group bg-gradient-to-br ${card.gradient} border border-white/50 rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 ${card.popular ? 'ring-2 ring-fuchsia-300 shadow-xl shadow-fuchsia-200/50' : ''
                                }`}
                        >
                            {card.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg">
                                        {t('mostPopular')}
                                    </div>
                                </div>
                            )}
                            <div className="text-center mb-6">
                                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${card.iconBg} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-white shadow-lg mx-auto`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                                    {card.title}
                                </h3>
                                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent mb-2">
                                    {card.price}
                                </div>
                                <p className="text-sm sm:text-base text-slate-600 font-medium">
                                    {card.description}
                                </p>
                            </div>
                            <ul className="space-y-3 mb-6 sm:mb-8">
                                {card.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-sm sm:text-base text-slate-700 font-medium">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={onGetStarted}
                                className={`w-full group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${card.buttonGradient} text-white font-black rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-200`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative">{card.buttonText}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SubscriptionCards;
