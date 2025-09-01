import { config } from "./config";
import { User, Category, Product } from "./models";
import { createUser } from "./repositories/userRepository";
import { getNextSequence } from "./repositories/sequence";

export async function seedInitialAdmin(): Promise<void> {
	const email = config.seedAdminEmail;
	const existing = await User.findOne({ email });
	if (existing) return;
	await createUser({ email, password: config.seedAdminPassword, role: "admin" });
}

export async function seedCategoriesAndProducts(): Promise<void> {
	// Clear existing data
	await Category.deleteMany({});
	await Product.deleteMany({});

	// Categories data
	const categoriesData = [
		{
			name: {
				en: "Doors & Gates",
				fr: "Portes et Portails",
				zh: "门和大门"
			},
			description: {
				en: "Different types of doors and gates for homes and buildings, combining functionality and design.",
				fr: "Différents types de portes et portails pour les maisons et les bâtiments, alliant fonctionnalité et design.",
				zh: "不同类型的门和大门，适用于住宅和建筑，兼具功能与设计。"
			}
		},
		{
			name: {
				en: "Stairs & Guardrails",
				fr: "Escaliers et Garde-corps",
				zh: "楼梯和护栏"
			},
			description: {
				en: "Indoor staircases and guardrails providing safety and style.",
				fr: "Escaliers intérieurs et garde-corps offrant sécurité et style.",
				zh: "室内楼梯和护栏，兼顾安全与美观。"
			}
		},
		{
			name: {
				en: "Elevators",
				fr: "Ascenseurs",
				zh: "电梯"
			},
			description: {
				en: "Elevators for residential and commercial use, ensuring smooth vertical mobility.",
				fr: "Ascenseurs pour un usage résidentiel et commercial, garantissant une mobilité verticale fluide.",
				zh: "适用于住宅和商业的电梯，确保平稳的垂直移动。"
			}
		},
		{
			name: {
				en: "Furniture",
				fr: "Mobilier",
				zh: "家具"
			},
			description: {
				en: "Furniture for homes and offices, combining comfort, function, and aesthetics.",
				fr: "Mobilier pour maisons et bureaux, alliant confort, fonctionnalité et esthétique.",
				zh: "适用于家庭和办公室的家具，融合舒适性、功能性与美观。"
			}
		},
		{
			name: {
				en: "Renovation & Construction Materials",
				fr: "Matériaux de Rénovation et Construction",
				zh: "翻新和建筑材料"
			},
			description: {
				en: "Materials for full-house renovation, including wood-based and ceramic materials.",
				fr: "Matériaux pour la rénovation complète de la maison, y compris le bois et la céramique.",
				zh: "全屋翻新材料，包括木质材料和陶瓷材料。"
			}
		},
		{
			name: {
				en: "Fixtures & Fittings",
				fr: "Installations et Équipements",
				zh: "设施和配件"
			},
			description: {
				en: "Sanitary fixtures and other essential fittings for buildings.",
				fr: "Installations sanitaires et autres équipements essentiels pour les bâtiments.",
				zh: "卫浴设施及建筑必备配件。"
			}
		}
	];

	// Create categories
	const createdCategories = [];
	for (const categoryData of categoriesData) {
		const categoryId = await getNextSequence("categories");
		const category = new Category({
			id: categoryId,
			...categoryData
		});
		await category.save();
		createdCategories.push(category);
	}

	// Products data
	const productsData = [
		// Doors & Gates (Category 1)
		{
			name: {
				en: "Wooden Door",
				fr: "Porte en bois",
				zh: "木门"
			},
			description: {
				en: "High-quality wooden door for residential use",
				fr: "Porte en bois de haute qualité pour usage résidentiel",
				zh: "高品质木门，适用于住宅"
			},
			price_cents: 25000, // $250
			image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[0]._id
		},
		{
			name: {
				en: "Garage Door",
				fr: "Porte de garage",
				zh: "车库门"
			},
			description: {
				en: "Automatic garage door with remote control",
				fr: "Porte de garage automatique avec télécommande",
				zh: "自动车库门，配备遥控器"
			},
			price_cents: 80000, // $800
			image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[0]._id
		},
		{
			name: {
				en: "Guardrail Gate",
				fr: "Portail à garde-corps",
				zh: "护栏门"
			},
			description: {
				en: "Security gate with guardrail design",
				fr: "Portail de sécurité avec design de garde-corps",
				zh: "安全门，采用护栏设计"
			},
			price_cents: 60000, // $600
			image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[0]._id
		},
		// Stairs & Guardrails (Category 2)
		{
			name: {
				en: "Indoor Staircase",
				fr: "Escalier intérieur",
				zh: "室内楼梯"
			},
			description: {
				en: "Custom indoor staircase with modern design",
				fr: "Escalier intérieur personnalisé avec design moderne",
				zh: "定制室内楼梯，现代设计"
			},
			price_cents: 120000, // $1,200
			image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[1]._id
		},
		{
			name: {
				en: "Guardrails",
				fr: "Garde-corps",
				zh: "护栏"
			},
			description: {
				en: "Safety guardrails for stairs and balconies",
				fr: "Garde-corps de sécurité pour escaliers et balcons",
				zh: "楼梯和阳台安全护栏"
			},
			price_cents: 40000, // $400
			image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[1]._id
		},
		{
			name: {
				en: "Balcony Guardrail",
				fr: "Garde-corps de balcon",
				zh: "阳台护栏"
			},
			description: {
				en: "Guardrails for balconies and terraces",
				fr: "Garde-corps pour balcons et terrasses",
				zh: "阳台和露台护栏"
			},
			price_cents: 30000, // $300
			image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[1]._id
		},
		// Elevators (Category 3)
		{
			name: {
				en: "Home Elevator",
				fr: "Ascenseur domestique",
				zh: "家用电梯"
			},
			description: {
				en: "Residential elevator for multi-story homes",
				fr: "Ascenseur résidentiel pour maisons multi-étages",
				zh: "多层住宅家用电梯"
			},
			price_cents: 1500000, // $15,000
			image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[2]._id
		},
		{
			name: {
				en: "Commercial Elevator",
				fr: "Ascenseur commercial",
				zh: "商用电梯"
			},
			description: {
				en: "Commercial elevator for office buildings",
				fr: "Ascenseur commercial pour immeubles de bureaux",
				zh: "办公楼商用电梯"
			},
			price_cents: 2500000, // $25,000
			image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[2]._id
		},
		// Furniture (Category 4)
		{
			name: {
				en: "Office Furniture",
				fr: "Mobilier de bureau",
				zh: "办公家具"
			},
			description: {
				en: "Complete office furniture set",
				fr: "Ensemble de mobilier de bureau complet",
				zh: "完整办公家具套装"
			},
			price_cents: 150000, // $1,500
			image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[3]._id
		},
		{
			name: {
				en: "Home Furniture",
				fr: "Mobilier de maison",
				zh: "家居家具"
			},
			description: {
				en: "Home furniture collection",
				fr: "Collection de mobilier pour la maison",
				zh: "家居家具系列"
			},
			price_cents: 100000, // $1,000
			image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[3]._id
		},
		// Renovation & Construction Materials (Category 5)
		{
			name: {
				en: "Full-house Renovation (Wood-based)",
				fr: "Rénovation complète (à base de bois)",
				zh: "全屋翻新（木质材料）"
			},
			description: {
				en: "Complete house renovation package using wood-based materials",
				fr: "Package de rénovation complète de maison utilisant des matériaux à base de bois",
				zh: "使用木质材料的全屋翻新套餐"
			},
			price_cents: 1000000, // $10,000
			image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[4]._id
		},
		{
			name: {
				en: "Ceramic Tile",
				fr: "Carreau en céramique",
				zh: "陶瓷砖"
			},
			description: {
				en: "High-quality ceramic tiles per square meter",
				fr: "Carreaux en céramique de haute qualité par mètre carré",
				zh: "高品质陶瓷砖，按平方米计算"
			},
			price_cents: 1500, // $15 per m²
			image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[4]._id
		},
		// Fixtures & Fittings (Category 6)
		{
			name: {
				en: "Sanitary Fixtures",
				fr: "Installations sanitaires",
				zh: "卫浴设备"
			},
			description: {
				en: "Complete sanitary fixtures for bathrooms",
				fr: "Installations sanitaires complètes pour salles de bain",
				zh: "完整卫浴设备套装"
			},
			price_cents: 50000, // $500
			image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[5]._id
		},
		{
			name: {
				en: "Kitchen Fixtures",
				fr: "Installations de cuisine",
				zh: "厨房设备"
			},
			description: {
				en: "Complete kitchen fixtures and fittings",
				fr: "Installations de cuisine complètes",
				zh: "完整厨房设备套装"
			},
			price_cents: 75000, // $750
			image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
			category_id: createdCategories[5]._id
		}
	];

	// Create products
	for (const productData of productsData) {
		const productId = await getNextSequence("products");
		const product = new Product({
			id: productId,
			...productData,
			is_active: true
		});
		await product.save();
	}

	console.log(`Seeded ${createdCategories.length} categories and ${productsData.length} products`);
}

export async function seedAll(): Promise<void> {
	console.log("Starting database seeding...");
	
	try {
		await seedInitialAdmin();
		console.log("Admin user seeded successfully");
		
		await seedCategoriesAndProducts();
		console.log("Categories and products seeded successfully");
		
		console.log("Database seeding completed successfully");
	} catch (error) {
		console.error("Error during seeding:", error);
		throw error;
	}
}

