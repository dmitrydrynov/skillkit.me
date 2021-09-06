/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationCircleIcon, XIcon } from '@heroicons/react/outline'
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

type SignInFormData = {
	email: string;
	password: string;
	rememberMe?: boolean;
};

const validationSchema = yup.object().shape({
	email: yup.string().email('Entered not email address').required('Email field is required'),
	password: yup.string().required('Password field is required'),
});

export default function SignInModal() {
	const [open, setOpen] = useState(true)
	const { register, handleSubmit, watch, formState: { errors } } = useForm<SignInFormData>({
		resolver: yupResolver(validationSchema)
	});
	const onSubmit = (data: any) => console.log(data, errors);

	const inputClassName = (hasError: boolean) => {
		const withError = 'appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm';
		const noError = 'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
		return hasError ? withError : noError
	}

	console.log(watch("email"));

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
				<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
							<div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
								<button
									type="button"
									className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									onClick={() => setOpen(false)}
								>
									<span className="sr-only">Close</span>
									<XIcon className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<Dialog.Title as="h3" className="text-lg mb-5 leading-6 font-medium text-gray-900">
								Sign in
							</Dialog.Title>
							<div className="mt-3 text-center sm:mt-0 sm:text-left">
								<div className="mt-2">
									<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
										<div>
											<label htmlFor="email" className="block text-sm font-medium text-gray-700">
												Email address
											</label>
											<div className="mt-1 relative">
												<input
													className={inputClassName(!!errors.email)}
													aria-invalid="true"
													aria-describedby="email-error"
													{...register("email", { required: true })}
												/>
												{!!errors.email && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
													<ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
												</div>}
											</div>
											<p className="mt-2 text-sm text-red-600" id="email-error">
												{errors.email?.message}
											</p>
										</div>

										<div>
											<label htmlFor="password" className="block text-sm font-medium text-gray-700">
												Password
											</label>
											<div className="mt-1 relative rounded-md shadow-sm">
												<input
													type="password"
													aria-invalid="true"
													aria-describedby="email-error"
													className={inputClassName(!!errors.password)}
													{...register("password", { required: true })}
												/>
												{!!errors.password && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
													<ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
												</div>}
											</div>
											<p className="mt-2 text-sm text-red-600" id="password-error">
												{errors.password?.message}
											</p>
										</div>

										{/* <div className="flex items-center justify-between">
											<div className="flex items-center">
												<input
													type="checkbox"
													className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
													{...register("rememberMe")}
												/>
												<label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
													Remember me
												</label>
											</div>

											<div className="text-sm">
												<a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
													Forgot your password?
												</a>
											</div>
										</div> */}

										<div>
											<button
												type="submit"
												className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
											>
												Sign in
											</button>
										</div>
									</form>

								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
