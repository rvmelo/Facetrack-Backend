import cron from 'node-cron';
import { updateInstagramJob } from './jobs/updateInstagram';
import { refreshInstagramTokensJob } from './jobs/refreshInstagramTokens';

class ManagerCron {
  jobs: cron.ScheduledTask[];

  constructor() {
    this.jobs = [updateInstagramJob, refreshInstagramTokensJob];
  }

  run(): void {
    this.jobs.forEach(job => job.start());
  }
}

export default ManagerCron;
