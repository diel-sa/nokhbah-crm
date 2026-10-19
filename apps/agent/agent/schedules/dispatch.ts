import { defineSchedule } from "eve/schedules";
import crm from "../channels/crm";
import { sweepBlankFacts } from "../lib/blank-facts";
import {
	pendingAgentRunIds,
	pendingBuilderSubmissionIds,
	queueDueAgentRuns,
} from "../lib/custom-agent-dispatch";
import { brief, drainAll, taskAuth } from "../lib/dispatch";
import { reconcileStaleTasks } from "../lib/stale-tasks";

export default defineSchedule({
	// NOTE: Vercel Hobby only permits cron jobs that run at most once per day.
	// The upstream value is "* * * * *" (every minute). For real-time agent
	// dispatch, upgrade to Vercel Pro (restore the every-minute value) or host
	// the agent on a VPS. See DEPLOY.md.
	cron: "0 5 * * *",
	async run({ receive, waitUntil, appAuth }) {
		waitUntil(
			Promise.all([
				sweepBlankFacts(),

				(async () => {
					await reconcileStaleTasks();
					await drainAll((task) =>
						receive(crm, {
							message: brief(task),
							target: { taskId: task.id },
							auth: taskAuth(task, appAuth),
						}),
					);
					await queueDueAgentRuns();
					const [builderIds, runIds] = await Promise.all([
						pendingBuilderSubmissionIds(),
						pendingAgentRunIds(),
					]);

					await Promise.all([
						...builderIds.map((builderSubmissionId) =>
							receive(crm, {
								message: "Continue a queued private agent-builder chat.",
								target: { builderSubmissionId },
								auth: appAuth,
							}),
						),
						...runIds.map((runId) =>
							receive(crm, {
								message: "Execute a queued deployed agent run.",
								target: { runId },
								auth: appAuth,
							}),
						),
					]);
				})(),
			]),
		);
	},
});
