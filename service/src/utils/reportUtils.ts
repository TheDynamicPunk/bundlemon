import { generateDiffReport, Report, Status } from 'bundlemon-utils';
import { generateLinkToReport } from './linkUtils';

import type { CommitRecordWithBase } from '../framework/mongo/commitRecords';

export function generateReport({ record, baseRecord }: CommitRecordWithBase): Report {
  const diffReport = generateDiffReport(record, baseRecord);

  const report: Report = {
    ...diffReport,
    metadata: {
      subProject: record.subProject,
      linkToReport: generateLinkToReport({ projectId: record.projectId, commitRecordId: record.id }),
      record,
      baseRecord,
    },
  };

  // If the record and the base record have the same branch, that probably mean it's a merge commit, so no need to fail the report
  if (report.status === Status.Fail && record.branch === baseRecord?.branch) {
    report.status = Status.Pass;
  }

  return report;
}

export function truncateString(input: string, maxLength: number) {
  if (input.length > maxLength) {
    return input.substring(0, maxLength) + '...';
  }

  return input;
}
