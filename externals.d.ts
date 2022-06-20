declare module '*.less';

declare module '*.module.less' {
	const resource: { [key: string]: string };
	export = resource;
}
