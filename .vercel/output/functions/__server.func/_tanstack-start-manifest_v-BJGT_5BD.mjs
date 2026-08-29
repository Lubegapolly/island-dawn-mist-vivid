//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-BJGT_5BD.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/guidelines",
			"/patients",
			"/reviews"
		],
		preloads: [
			"/assets/index-B8WbBwgU.js",
			"/assets/jsx-runtime-Cx0BB4qO.js",
			"/assets/store-DtwziKjX.js",
			"/assets/createLucideIcon-D9_3wSAh.js",
			"/assets/preload-helper-B4nf6F1Z.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-B8WbBwgU.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-Cep_mTGX.js",
			"/assets/badge-DTZzSyDu.js",
			"/assets/types-Q1RQEM4z.js"
		]
	},
	"/guidelines": {
		filePath: "/workspace/src/routes/guidelines.tsx",
		children: void 0,
		preloads: ["/assets/guidelines-F3od6BPY.js"]
	},
	"/patients": {
		filePath: "/workspace/src/routes/patients.tsx",
		children: ["/patients/$patientId", "/patients/new"],
		preloads: [
			"/assets/patients-DTVrBLal.js",
			"/assets/badge-DTZzSyDu.js",
			"/assets/input-BVassEbB.js"
		]
	},
	"/reviews": {
		filePath: "/workspace/src/routes/reviews.tsx",
		children: void 0,
		preloads: [
			"/assets/reviews-CY-uTp2U.js",
			"/assets/copy-BGQ2lkSN.js",
			"/assets/phone-Cfjqv5UY.js",
			"/assets/badge-DTZzSyDu.js"
		]
	},
	"/patients/$patientId": {
		filePath: "/workspace/src/routes/patients.$patientId.tsx",
		children: ["/patients/$patientId/visit"],
		preloads: [
			"/assets/patients._patientId-xAJ2g1fs.js",
			"/assets/phone-Cfjqv5UY.js",
			"/assets/plan-panel-X8dAzdai.js",
			"/assets/cds-CGXKkwjQ.js"
		]
	},
	"/patients/new": {
		filePath: "/workspace/src/routes/patients.new.tsx",
		children: void 0,
		preloads: [
			"/assets/patients.new-C44vGY61.js",
			"/assets/useNavigate-BL4BtR34.js",
			"/assets/types-Q1RQEM4z.js",
			"/assets/cds-CGXKkwjQ.js",
			"/assets/label-D60z-4mQ.js"
		]
	},
	"/patients/$patientId/visit": {
		filePath: "/workspace/src/routes/patients.$patientId.visit.tsx",
		children: void 0,
		preloads: [
			"/assets/patients._patientId.visit-7Y_ZmMYt.js",
			"/assets/useNavigate-BL4BtR34.js",
			"/assets/types-Q1RQEM4z.js",
			"/assets/label-D60z-4mQ.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
