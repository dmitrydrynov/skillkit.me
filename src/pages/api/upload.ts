import fs from 'fs';
import { withSentry } from '@sentry/nextjs';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
	api: {
		bodyParser: false,
	},
};

const saveFile = async (dir: string, file: any, prefix: string = '') => {
	let extension = file.originalFilename.split('.').pop();
	extension = extension ? '.' + extension : '';
	const filePath = `/${dir}/${prefix}${file.newFilename}${extension}`;

	try {
		const data = await fs.promises.readFile(file.filepath);

		if (!fs.existsSync('./public/' + dir)) {
			await fs.promises.mkdir('./public/' + dir, { recursive: true });
		}

		await fs.promises.writeFile('./public' + filePath, data);
		await fs.promises.unlink(file.filepath);

		return Promise.resolve(filePath);
	} catch (error) {
		return Promise.reject(error);
	}
};

const removeFile = async (filePath: string) => {
	try {
		await fs.promises.unlink('./public' + filePath);

		return Promise.resolve(true);
	} catch (error) {
		return Promise.resolve(false);
	}
};

// eslint-disable-next-line import/no-anonymous-default-export
const handler = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(404).send('');
	}

	const form = new formidable.IncomingForm();

	form.parse(req, async function (err: any, fields: any, files: any) {
		try {
			const savedFilePath = await saveFile(fields.dir, files.file, 'avatar-');

			/** Remove if a new created */
			if (savedFilePath && fields.replaceFile) {
				await removeFile(fields.replaceFile);
			}

			return res.status(201).send({ path: savedFilePath });
		} catch (error) {
			return res.status(404).send({ error: error || 'Something wrong!' });
		}
	});
};

export default withSentry(handler);
