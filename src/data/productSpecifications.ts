// Product specifications and detailed information
export interface ProductSpecification {
    material?: string;
    features?: string[];
    use?: string[];
    sizes?: string[];
    dimensions?: string;
    length?: string;
    benefits?: string[];
    applications?: string[];
    description?: string;
}

export interface ProductTypeSpec {
    category: string;
    productType: string;
    specifications: ProductSpecification;
}

// Bath Line Products Specifications
export const bathLineSpecs: Record<string, ProductTypeSpec> = {
    'Bathrobe': {
        category: 'Bath Line',
        productType: 'Bathrobe',
        specifications: {
            material: 'Terry or waffle fabric',
            features: ['Soft', 'Premium', 'Highly absorbent', 'Quick-dry'],
            use: ['Hotels', 'Spas', 'Home'],
            sizes: ['S', 'M', 'L', 'XL'],
            length: '~105–125 cm'
        }
    },
    'Bath Towel': {
        category: 'Bath Line',
        productType: 'Bath Towel',
        specifications: {
            material: 'Thick terry cotton',
            features: ['Plush', 'Durable', 'High absorbency'],
            dimensions: '70 × 140 cm (Optional: 75 × 150 cm)'
        }
    },
    'Beach Towel': {
        category: 'Bath Line',
        productType: 'Beach Towel',
        specifications: {
            material: 'Soft terry fabric',
            features: ['Large', 'Fast-drying', 'Stylish prints'],
            dimensions: '80 × 160 cm (Optional: 90 × 180 cm)'
        }
    },
    'Face Towel': {
        category: 'Bath Line',
        productType: 'Face Towel',
        specifications: {
            features: ['Gentle', 'Skin-friendly'],
            use: ['Facial care', 'Skincare routines'],
            dimensions: '30 × 30 cm (Optional: 33 × 33 cm)'
        }
    },
    'Kitchen Towel': {
        category: 'Bath Line',
        productType: 'Kitchen Towel',
        specifications: {
            material: 'Durable cotton',
            use: ['Utensils', 'Surfaces', 'Dish handling'],
            dimensions: '40 × 60 cm (Optional: 45 × 70 cm)'
        }
    },
    'Napkin': {
        category: 'Bath Line',
        productType: 'Napkin',
        specifications: {
            material: 'Cotton or blended fabric',
            use: ['Home dining', 'Restaurants', 'Events'],
            sizes: ['30 × 30 cm', '40 × 40 cm']
        }
    },
    'Terry Kitchen Towel': {
        category: 'Bath Line',
        productType: 'Terry Kitchen Towel',
        specifications: {
            features: ['Thick', 'Extra-absorbent', 'Durable'],
            use: ['Dish drying', 'Spill soaking', 'Cleaning'],
            dimensions: '40 × 60 cm (Optional: 38 × 63 cm)'
        }
    }
};

// Cow Dung Products Specifications
export const cowDungSpecs: ProductTypeSpec = {
    category: 'Cow Dung Cake',
    productType: 'Cow Dung Cake',
    specifications: {
        description: 'Natural, sun-dried discs made from pure cow manure with organic residue. Eco-friendly and widely used in agriculture, spiritual practices, and rural households.',
        applications: [
            'Organic fertilizer (slow-release, improves soil, adds NPK)',
            'Compost booster',
            'Organic pesticide preparation',
            'Fuel source',
            'Religious & cultural rituals (Havan, Pooja)',
            'Natural mosquito repellent',
            'Construction & insulation (mud houses)'
        ],
        benefits: [
            '100% natural and eco-friendly',
            'Improves soil fertility',
            'Cost-effective and sustainable',
            'Suitable for organic farming exporters',
            'Long shelf life when dried properly'
        ]
    }
};

// Cow Dung Product Subcategories
export const cowDungSubcategories = {
    'Fertilizer Use': {
        forms: ['Cake form', 'Powdered form']
    },
    'Spiritual Use': {
        applications: ['Religious & cultural rituals (Havan, Pooja)']
    }
};

// Helper function to get specifications for a product type
export const getProductSpecifications = (productType: string): ProductSpecification | null => {
    // Check bath line products
    if (bathLineSpecs[productType]) {
        return bathLineSpecs[productType].specifications;
    }

    // Check cow dung products
    if (productType.toLowerCase().includes('cow dung') ||
        productType.toLowerCase().includes('fertilizer') ||
        productType.toLowerCase().includes('dhoop') ||
        productType.toLowerCase().includes('incense')) {
        return cowDungSpecs.specifications;
    }

    return null;
};

// Helper function to format specifications for display
export const formatSpecifications = (specs: ProductSpecification): string[] => {
    const formatted: string[] = [];

    if (specs.material) {
        formatted.push(`Material: ${specs.material}`);
    }

    if (specs.features && specs.features.length > 0) {
        formatted.push(`Features: ${specs.features.join(', ')}`);
    }

    if (specs.use && specs.use.length > 0) {
        formatted.push(`Use: ${specs.use.join(', ')}`);
    }

    if (specs.sizes && specs.sizes.length > 0) {
        formatted.push(`Sizes: ${specs.sizes.join(', ')}`);
    }

    if (specs.dimensions) {
        formatted.push(`Dimensions: ${specs.dimensions}`);
    }

    if (specs.length) {
        formatted.push(`Length: ${specs.length}`);
    }

    if (specs.applications && specs.applications.length > 0) {
        formatted.push(`Applications: ${specs.applications.join(', ')}`);
    }

    if (specs.benefits && specs.benefits.length > 0) {
        formatted.push(`Benefits: ${specs.benefits.join(', ')}`);
    }

    return formatted;
};
