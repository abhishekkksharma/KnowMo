import { UserRound } from "lucide-react";

interface IUpdate {
  update: string;
  message: string;
  updatingUser: string;
  createdAt: string;
}

function UpdatesCard({
  update,
  message,
  updatingUser,
  createdAt,
}: IUpdate) {
  return (
    <div className="w-full rounded-3xl bg-white px-6 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:bg-neutral-950">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          <UserRound size={20} />
        </div>

        <div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
            {update}
          </h3>

          <p className="text-sm text-neutral-500">
            {updatingUser}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
        {message}
      </p>

      {/* Divider */}
      <div className="my-3 h-px bg-neutral-200 dark:bg-neutral-800" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">
          {new Date(createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {/* <button className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-black">
          View
        </button> */}
      </div>
    </div>
  );
}

export default UpdatesCard;