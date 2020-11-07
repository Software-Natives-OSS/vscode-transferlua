import * as path from 'path';
import { Mapping } from './mapping';

export class LuaStateMapping {
	constructor(private wsRootPath: string, private mappings: Mapping[]) {}
		
	public findLuaState(documentPath: string): string
	{
		const workspaceRelativePath = this.determineWorkspaceRelativePath(documentPath);
		for (const mapping of this.mappings) {
			if (this.pathsMatch(workspaceRelativePath, mapping.path)) {
				return mapping.state;
			}
		}
		return "";
	}

	private pathsMatch(workspaceRelativePath: string, mappedPath: string): boolean {
		// this path in the "native" form, e.g. "Folder/SubFolder" on *nix or "Folder\\SubFolder" on Windows
		const workspacePathParts = workspaceRelativePath.split(path.sep);
		// The mapping path is, by defintion, in *nix format style (so that the configuration can be used cross platform)
		const mappedPathParts = mappedPath.split('/');

		// if mapped is "shorter", it can't match.
		if (mappedPathParts.length <= workspacePathParts.length) {
			// compare the 'mapped path' array with the first few path parts of the 'workspace parts'
			if (mappedPathParts.every((value, index) => workspacePathParts[index] === value)) {
				return true;
			}
		}
		return false;
	}

	private determineWorkspaceRelativePath(filePath: string | undefined): string {
		if (this.wsRootPath && filePath && filePath.startsWith(this.wsRootPath)) {
			let relativePath = filePath.substr(this.wsRootPath.length);
			if (relativePath.startsWith(path.sep)) {
				relativePath = relativePath.substr(1);
			}
			return relativePath;
		}
		// not a workspace path
		return filePath ? filePath : "";
	}

}