import { Input } from "@/components/ui/input";
import { EditUserForm } from "@/lib/components/users/edit-user-form";
import {
	getEnrichedUsers,
	getEnrichedUserById,
} from "@/lib/db/getEnrichedUsers";
import { rbac } from "@/authz";

export default async function UserEditPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const user = await getEnrichedUserById(id);
	const roles = await rbac.getRoles();
	return <div>{user && <EditUserForm user={user} roles={roles} />}</div>;
}
