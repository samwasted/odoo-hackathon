import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "../ui/Icons";
import { SendRequestModal } from "../modal/send-req-modal";

interface UserCardProps {
  id: string;
  name: string;
  image?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  onRequest?: () => void;
}

export default function UserCard({
  name,
  image,
  skillsOffered,
  skillsWanted,
  onRequest,
}: UserCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex-shrink-0">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={image || ""}
              alt={name}
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>
              {name?.[0]?.toUpperCase() || <Icons.user className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold">{name}</h3>

          <div>
            <p className="text-sm font-medium text-gray-600">Skills Offered:</p>
            <p className="text-sm">{skillsOffered.join(", ") || "None"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Skills Wanted:</p>
            <p className="text-sm">{skillsWanted.join(", ") || "None"}</p>
          </div>
        </div>

        {onRequest && (
          <div className="mt-4 md:mt-0">
            <SendRequestModal
              offeredSkills={["PROGRAMMING", "DESIGN"]} // TODO: replace with logged-in user's skills
              wantedSkills={skillsWanted}
              onSend={(data) => {
                console.log("Send this to API:", data);
                onRequest?.();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
