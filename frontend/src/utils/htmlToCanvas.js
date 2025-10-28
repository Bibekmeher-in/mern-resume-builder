// Enhanced color conversion function that handles modern CSS color functions
const convertColorToRGB = (colorValue) => {
    if (!colorValue || colorValue === 'transparent' || colorValue === 'rgba(0, 0, 0, 0)') {
        return colorValue;
    }

    // Skip CSS variables and already converted colors
    if (colorValue.includes('var(') || colorValue.startsWith('rgb(') || colorValue.startsWith('#')) {
        return colorValue;
    }

    try {
        // Create a temporary element to leverage browser's CSS engine
        const tempElement = document.createElement('div');
        tempElement.style.color = colorValue;
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-9999px';
        tempElement.style.visibility = 'hidden';
        document.body.appendChild(tempElement);

        // Get the computed RGB value
        const computedColor = getComputedStyle(tempElement).color;

        // Clean up
        document.body.removeChild(tempElement);

        // Return the RGB value if it was converted
        if (computedColor && computedColor !== colorValue && computedColor.startsWith('rgb')) {
            return computedColor;
        }

        // Fallback to canvas method for edge cases
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = colorValue;
        const canvasColor = ctx.fillStyle;

        if (canvasColor && canvasColor !== colorValue) {
            return canvasColor;
        }

        return colorValue;
    } catch (error) {
        console.warn('Color conversion failed for:', colorValue, error);
        return colorValue;
    }
};

const convertToRGB = (element) => {
    const style = window.getComputedStyle(element);
    const colorProperties = [
        'color',
        'background-color',
        'backgroundColor',
        'border-color',
        'border-top-color',
        'border-right-color',
        'border-bottom-color',
        'border-left-color',
        'borderColor',
        'borderTopColor',
        'borderRightColor',
        'borderBottomColor',
        'borderLeftColor'
    ];

    colorProperties.forEach(prop => {
        try {
            const value = style[prop];
            if (value && value !== 'transparent' && value !== 'rgba(0, 0, 0, 0)') {
                const rgbValue = convertColorToRGB(value);
                if (rgbValue && rgbValue !== value) {
                    element.style.setProperty(prop, rgbValue, 'important');
                }
            }
        } catch (e) {
            console.warn(`Failed to convert ${prop} for element:`, element, e);
        }
    });

    // Handle background property for complex backgrounds
    try {
        const background = style.background;
        if (background && background !== 'transparent' && background !== 'rgba(0, 0, 0, 0)' &&
            !background.includes('url(') && !background.includes('gradient')) {
            const rgbValue = convertColorToRGB(background);
            if (rgbValue && rgbValue !== background) {
                element.style.setProperty('background', rgbValue, 'important');
            }
        }
    } catch (e) {
        console.warn('Failed to convert background for element:', element, e);
    }
};

export const prepareForCanvas = (element) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = element.offsetWidth + 'px';
    container.style.height = element.offsetHeight + 'px';
    container.style.backgroundColor = '#FFFFFF';
    document.body.appendChild(container);

    // Clone the element
    const clone = element.cloneNode(true);
    container.appendChild(clone);

    // Process all elements recursively
    const processElement = (el) => {
        convertToRGB(el);
        Array.from(el.children).forEach(processElement);
    };

    processElement(clone);

    return {
        container,
        clone
    };
};

// Cleanup function
export const cleanupCanvas = (container) => {
    if (container && container.parentNode) {
        container.parentNode.removeChild(container);
    }
};