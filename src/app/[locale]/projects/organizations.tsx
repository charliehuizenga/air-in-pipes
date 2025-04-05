"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Organizations({
  orgs,
}: {
  orgs: { id: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  if (!orgs || orgs.length === 0) {
    return (
      <p className="text-gray-500">
        You&apos;re not a member of any organizations yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 border border-gray-300 rounded-md mt-4">
      {orgs.map((org) => (
        <li
          key={org.id}
          onClick={() => router.push(`/${locale}/org/${org.id}`)}
          className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between transition-colors"
        >
          <span className="text-gray-900 font-medium">{org.name}</span>
          <span className="text-sm text-sky-600 hover:underline">View →</span>
        </li>
      ))}
    </ul>
  );
}
