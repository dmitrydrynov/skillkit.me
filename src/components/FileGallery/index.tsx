import { useEffect, useState } from 'react';
import { getImageSizeFromName } from '@helpers/file';
import { WarningTwoTone, DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Popconfirm, Row, Typography } from 'antd';
import { index, Matrix, multiply, ones, range, zeros } from 'mathjs';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { FcLink } from 'react-icons/fc';
import styles from './style.module.less';

type FileGalleryArgs = {
	fileList: any[];
	onDelete?: (record: any) => void;
	onEdit?: (record: any) => void;
	onItemClick?: (itemIndex: number) => void;
	onlyView?: boolean;
};

const FileGallery = ({
	fileList,
	onDelete = (record: any) => {},
	onEdit = (record: any) => {},
	onItemClick = (recordId: number) => {},
	onlyView = false,
}: FileGalleryArgs) => {
	const breakpoints = { lg: 1200, md: 992, sm: 768, xs: 576, xxs: 312 };
	const responsiveCols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
	const [currentBreakpoint, setCurrentBreakpoint] = useState('md');
	const zoom = 1 / 5;
	const [cellWidth, setCellWidth] = useState<number>(100);
	const [rowHeight, setRowHeight] = useState<number>(100);
	const [layout, setLayout] = useState<any>({ [currentBreakpoint]: [] });

	const handleBreakpointChange = (breakpoint) => {
		const cellSize = Math.round(breakpoints[breakpoint] / responsiveCols[breakpoint]);
		setCellWidth(cellSize);
		setRowHeight(cellSize);
		setCurrentBreakpoint(breakpoint);
	};

	const calculateCellSize = (imageUrl): number[] => {
		let { width, height } = getImageSizeFromName(imageUrl, zoom);
		const rowWidth: number = breakpoints[currentBreakpoint];
		const columnsCount: number = responsiveCols[currentBreakpoint];

		/** scale down width if it is greater than (rowWidth / 2) */
		if (width > rowWidth / 2) {
			width = width / 2;
			height = height / 2;
		}

		/** resize for cell grid */
		let cols = width / cellWidth;
		let rows = height / rowHeight;
		const ratio = cols / rows;

		if (rows < 1) {
			cols = ratio;
			rows = 1;
		}

		if (cols < 1) {
			rows = ratio;
			cols = 1;
		}

		if (cols > columnsCount) {
			cols = 1;
			rows = 1;
		}

		return [Math.round(rows), Math.round(cols)];
	};

	useEffect(() => {
		handleBreakpointChange('lg');
	}, []);

	useEffect(() => {
		const nextPosition = { x: 0, y: 0 };
		const columnsCount: number = responsiveCols[currentBreakpoint];
		const layoutMatrix: Matrix = zeros(1, columnsCount) as Matrix;

		// console.log('[INIT]', columnsCount, layoutMatrix);

		const newLayout = fileList.map((record, idx) => {
			let [layoutRows] = layoutMatrix.size();
			const [rows, cols] = record.type === 'LINK' ? [1, 2] : calculateCellSize(record.url);

			// set up actual position
			let x = nextPosition.x;
			let y = nextPosition.y;

			// add row if need
			if (x + cols > columnsCount) {
				x = 0;
				y++;
			}

			if (cols <= 2) {
				y = 0;
			}

			// console.log('%c Item ' + record.id, 'background: #222; color: #bada55');
			// console.log({ size: [rows, cols], pos: [x, y] });

			const filler = rows === 1 && cols === 1 ? +record.id : multiply(ones([rows, cols]), +record.id);
			let subsetRow = rows > 1 ? range(y, y + rows) : y;
			let subsetColumn = cols > 1 ? range(x, x + cols) : x;
			let isEmpty = true;
			let t = 0;

			if (y + rows > layoutRows) {
				layoutMatrix.resize([y + rows, columnsCount]);
				[layoutRows] = layoutMatrix.size();
			}

			do {
				t++;
				// console.log('filler', t, layoutMatrix.size(), subsetRow.toString(), subsetColumn.toString(), filler);

				let field = layoutMatrix.subset(index(subsetRow, subsetColumn)) as Matrix;

				// check cell about empty
				if (typeof field === 'number') {
					isEmpty = field === 0;
				} else {
					try {
						field.forEach(function (value) {
							if (value !== 0) {
								isEmpty = false;
								throw Error();
							}
						});

						isEmpty = true;
					} catch (e) {}
				}

				// console.log('isEmpty', isEmpty, field);

				if (!isEmpty) {
					x = x + 1;

					if (x + cols > columnsCount) {
						x = 0;
						y++;
					}

					if (y + rows > layoutRows) {
						layoutMatrix.resize([y + rows, columnsCount]);
						[layoutRows] = layoutMatrix.size();
					}

					subsetColumn = cols > 1 ? range(x, x + cols) : x;
					subsetRow = rows > 1 ? range(y, y + rows) : y;
				}
			} while (!isEmpty && t < 10);

			layoutMatrix.subset(index(subsetRow, subsetColumn), filler);

			// console.log('[FINAL]', layoutMatrix);

			const data = {
				i: 'n' + idx.toString(),
				x,
				y,
				w: cols,
				h: rows,
			};

			// update next position
			nextPosition.x = x + cols;
			nextPosition.y = y;

			return data;
		});

		setLayout({ [currentBreakpoint]: newLayout });
	}, [currentBreakpoint, fileList]);

	// Click on View only mode
	const handleItemClick = (record: any, idx: number) => {
		if (!onlyView) {
			return;
		}

		if (record.type === 'LINK') {
			window.open(record.url, '_blank');
		} else {
			onItemClick(record.id);
		}
	};

	return (
		<ResponsiveGridLayout
			className={styles.fileGallery}
			rowHeight={rowHeight}
			breakpoints={breakpoints}
			cols={responsiveCols}
			isDraggable={false}
			isResizable={false}
			onBreakpointChange={handleBreakpointChange}
			layouts={layout}
		>
			{layout[currentBreakpoint]?.length > 0 &&
				fileList.map((record, idx) => {
					return (
						!!layout[currentBreakpoint][idx] && (
							<div
								className={styles['item-' + record.type.toLowerCase()]}
								key={'n' + idx}
								style={{ backgroundImage: record.type === 'LINK' ? null : `url(${record.url})` }}
								onClick={() => handleItemClick(record, idx)}
							>
								{!onlyView && (
									<Popconfirm
										key="delete-user-file"
										title="Are you sure to delete this item?"
										onConfirm={() => onDelete(record)}
										okText="Yes"
										cancelText="No"
										icon={<WarningTwoTone />}
									>
										<Button shape="circle" size="small" className="close">
											<DeleteOutlined />
										</Button>
									</Popconfirm>
								)}

								{record.type === 'LINK' && (
									<Row style={{ width: '100%', textAlign: 'center' }} align="middle" justify="center">
										<Col>
											<FcLink size={24} />
											<br />
											<Typography.Text ellipsis={{ tooltip: true }}>{record.title}</Typography.Text>
										</Col>
									</Row>
								)}
								{!onlyView && (
									<Row className="bottom" align="middle" wrap={false}>
										<Col flex={1}>
											<Typography.Text strong ellipsis={{ tooltip: true }} style={{ color: '#fff' }}>
												{record.title}
											</Typography.Text>
										</Col>
										<Col flex={0}>
											<Button size="small" style={{ marginLeft: '4px' }} onClick={() => onEdit(record)}>
												Edit
											</Button>
										</Col>
									</Row>
								)}
							</div>
						)
					);
				})}
		</ResponsiveGridLayout>
	);
};

export default FileGallery;
