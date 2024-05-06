module.exports = {
	distDir: "build",
	images: {
		formats: ["image/avif", "image/webp"],
	},
	webpack: (config) => {
		config.module = {
			...config.module,
			exprContextCritical: false,
		}
		return config
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "6mb",
		},
	},
}
