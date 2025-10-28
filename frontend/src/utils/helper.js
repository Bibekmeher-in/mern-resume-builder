import html2canvas from "html2canvas";
import moment from "moment"
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}


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

export function inlineAllComputedStyles(rootElement) {
    const nodes = [rootElement, ...rootElement.querySelectorAll("*")];
    nodes.forEach((node) => {
        const cs = window.getComputedStyle(node);
        let cssText = "";
        for (let i = 0; i < cs.length; i++) {
            const prop = cs[i];
            let val = cs.getPropertyValue(prop);

            // Convert modern color functions to RGB
            if (val && !val.includes('var(') && !val.startsWith('rgb(') && !val.startsWith('#') &&
                val !== 'transparent' && val !== 'rgba(0, 0, 0, 0)') {
                const rgbVal = convertColorToRGB(val);
                if (rgbVal && rgbVal !== val) {
                    val = rgbVal;
                }
            }

            cssText += `${prop}:${val};`;
        }
        node.style.cssText = cssText;
    });
}

export const getLightColorFromImage = (imageUrl) => {
    return new Promise((resolve) => {
        if (!imageUrl || typeof imageUrl !== "string") {
            return resolve("#ffffff")
        }

        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")

            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
            let r = 0,
                g = 0,
                b = 0,
                count = 0

            for (let i = 0; i < data.length; i += 4) {
                const red = data[i]
                const green = data[i + 1]
                const blue = data[i + 2]
                const brightness = (red + green + blue) / 3

                if (brightness > 100) {
                    r += red
                    g += green
                    b += blue
                    count++
                }
            }

            if (count === 0) {
                resolve("#ffffff")
            } else {
                r = Math.round(r / count)
                g = Math.round(g / count)
                b = Math.round(b / count)
                resolve(`rgb(${r}, ${g}, ${b})`)
            }
        }

        img.onerror = () => {
            // Fallback to white if image can’t load
            resolve("#ffffff")
        }

        if (!imageUrl.startsWith("data:")) {
            img.crossOrigin = "anonymous"
        }
        img.src = imageUrl
    })
}

export function formatYearMonth(yearMonth) {
    return yearMonth ? moment(yearMonth, "YYYY-MM").format("MMM YYYY") : ""
}

export const fixTailwindColors = (rootElement) => {
    if (!rootElement) return
    const elements = rootElement.querySelectorAll("*")
    elements.forEach((el) => {
        const style = window.getComputedStyle(el)
        const colorProps = {
            color: "#000", // text color to black
            backgroundColor: "#fff", // background to white
            borderColor: "#000" // border to black
        };

        Object.keys(colorProps).forEach((prop) => {
            const val = style[prop] || ""
            if (val.includes("oklch")) {
                el.style[prop] = colorProps[prop]
            }
        })

        // If this is an SVG element, also override inline fill/stroke attributes
        if (el instanceof SVGElement) {
            const fill = el.getAttribute("fill")
            if (fill && fill.includes("oklch")) {
                el.setAttribute("fill", "#000")
            }
            const stroke = el.getAttribute("stroke")
            if (stroke && stroke.includes("oklch")) {
                el.setAttribute("stroke", "#000")
            }
        }
    })
}

export const convertElementColors = (element) => {
    const getComputedRGBColor = (color) => {
        try {
            // Use inline style on temp element for better color conversion
            const temp = document.createElement('div');
            temp.style.color = color;
            temp.style.position = 'absolute';
            temp.style.left = '-9999px';
            document.body.appendChild(temp);
            const rgbColor = getComputedStyle(temp).color;
            document.body.removeChild(temp);
            return rgbColor;
        } catch (e) {
            console.warn('DOM color conversion failed:', e);
            try {
                // Fallback to canvas method
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = color;
                return ctx.fillStyle;
            } catch (e2) {
                console.warn('Canvas color conversion failed:', e2);
                return color; // final fallback
            }
        }
    };

    const convertElement = (el) => {
        const style = getComputedStyle(el);
        ['color', 'background-color', 'border-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'].forEach(prop => {
            try {
                const color = style[prop];
                if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent' && !color.includes('var(')) {
                    const rgbColor = getComputedRGBColor(color);
                    if (rgbColor && rgbColor !== color) {
                        el.style.setProperty(prop, rgbColor, 'important');
                    }
                }
            } catch (e) {
                console.warn('Color conversion failed for:', prop, e);
            }
        });

        // Handle background property for solid colors
        try {
            const background = style.background;
            if (background && background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent' && !background.includes('url(') && !background.includes('gradient')) {
                const rgbColor = getComputedRGBColor(background);
                if (rgbColor && rgbColor !== background) {
                    el.style.setProperty('background', rgbColor, 'important');
                }
            }
        } catch (e) {
            console.warn('Background conversion failed:', e);
        }
    };

    // Convert colors recursively
    const processElement = (el) => {
        convertElement(el);
        Array.from(el.children).forEach(processElement);
    };

    processElement(element);
};

export async function captureElementAsImage(element) {
    if (!element) throw new Error("No element provided");

    const clone = element.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.top = "-9999px";
    clone.style.left = "0";
    clone.style.opacity = "0";
    const { width, height } = element.getBoundingClientRect();
    clone.style.width = `${width}px`;
    clone.style.height = `${height}px`;
    document.body.appendChild(clone);

    const override = document.createElement("style");
    override.id = "__html2canvas_override__";
    override.textContent = `
    * {
      color: #000 !important;
      background-color: #fff !important;
      border-color: #000 !important;
      box-shadow: none !important;
      background-image: none !important;
    }
  `;
    document.head.appendChild(override);

    try {

        const canvas = await html2canvas(clone, {
            scale: 3,
            useCORS: true,
            logging: false,
            backgroundColor: "#FFFFFF",
        });
        return canvas.toDataURL("image/png");
    } finally {

        document.body.removeChild(clone);
        document.head.removeChild(override);
    }
}

export const dataURLtoFile = (dataUrl, fileName) => {
    const [header, base64] = dataUrl.split(",")
    const mimeMatch = header.match(/:(.*?);/)
    const mime = mimeMatch ? mimeMatch[1] : "image/png"
    const bstr = atob(base64)
    const len = bstr.length
    const u8arr = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
        u8arr[i] = bstr.charCodeAt(i)
    }

    return new File([u8arr], fileName, { type: mime })
}

//IN HELPER YOU WILL GET MULTIPLE HELPER FUNCTION LIKE WISE AS IT IS EXPLAINED BRIEFLY ON THE TOP OF EACH SO GO THROUGH
//TO GET BETTER KNOWLEDGE ....