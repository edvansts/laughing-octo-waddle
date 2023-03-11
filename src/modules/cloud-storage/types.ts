export type PartialDriveFile = {
  id: string;
  name: string;
};

export type SearchResultResponse = {
  kind: 'drive#fileList';
  nextPageToken: string;
  incompleteSearch: boolean;
  files: PartialDriveFile[];
};
