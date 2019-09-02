import Cancel from './Cancel'
import { CancelExecutor, CancelTokenSource, Canceler } from '../types'

interface ResolvePromise {
	(reason?: Cancel): void
}

export default class CancelToken {
	promise: Promise<Cancel>
	reason?: Cancel

	static source(): CancelTokenSource {
		let cancel!: Canceler
		const token = new CancelToken(c => {
			cancel = c
		})

		return {
			cancel,
			token,
		}
	}

	throwIfRequested(): void {
		if (this.reason) {
			throw this.reason
		}
	}

	constructor(executor: CancelExecutor) {
		let resolvePromise: ResolvePromise
		this.promise = new Promise<Cancel>(resolve => {
			resolvePromise = resolve
		})

		executor(message => {
			if (this.reason) {
				return
			}

			this.reason = new Cancel(message)
			resolvePromise(this.reason)
		})
	}
}
