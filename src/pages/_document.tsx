/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @next/next/no-document-import-in-page */
import React from 'react';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

React.useLayoutEffect = React.useEffect;

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html>
				<Head />
				<body>
					<Main />
					<NextScript />
					<noscript
						dangerouslySetInnerHTML={{
							__html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K9N6B7P" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
						}}
					/>
				</body>
			</Html>
		);
	}
}

export default MyDocument;
