const convertToRGBColor = (element) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = getComputedStyle(element).color;
    return ctx.fillStyle;
};

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

export const prepareDomForCapture = (element) => {
    // Create an off-screen container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm'; // A4 width
    container.style.height = '297mm'; // A4 height
    container.style.backgroundColor = '#FFFFFF';
    document.body.appendChild(container);

    // Clone the element
    const clone = element.cloneNode(true);
    container.appendChild(clone);

    // Process all elements recursively
    const processElement = (el) => {
        const computedStyle = window.getComputedStyle(el);
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

        // Convert colors to RGB
        colorProperties.forEach(prop => {
            try {
                const originalColor = computedStyle[prop];
                if (originalColor && originalColor !== 'transparent' && originalColor !== 'rgba(0, 0, 0, 0)') {
                    const rgbColor = convertColorToRGB(originalColor);
                    if (rgbColor && rgbColor !== originalColor) {
                        el.style.setProperty(prop, rgbColor, 'important');
                    }
                }
            } catch (e) {
                console.warn(`Failed to convert ${prop} for element:`, el, e);
            }
        });

        // Handle background property for complex backgrounds
        try {
            const background = computedStyle.background;
            if (background && background !== 'transparent' && background !== 'rgba(0, 0, 0, 0)' &&
                !background.includes('url(') && !background.includes('gradient')) {
                const rgbColor = convertColorToRGB(background);
                if (rgbColor && rgbColor !== background) {
                    el.style.setProperty('background', rgbColor, 'important');
                }
            }
        } catch (e) {
            console.warn('Failed to convert background for element:', el, e);
        }

        // Process children
        Array.from(el.children).forEach(processElement);
    };

    processElement(clone);

    return {
        container,
        clonedElement: clone
    };
};

export const cleanupDomCapture = (container) => {
    if (container && container.parentNode) {
        container.parentNode.removeChild(container);
    }
};