declare global {
	interface Window {
		dataLayer?: any[];
	}
}

export function gtmEvent(eventName: string, props?: object) {
	if (typeof window === 'undefined' || !window.dataLayer) return false;

	if (window.dataLayer) {
		window.dataLayer.push({ event: eventName, ...props });
	}
}
