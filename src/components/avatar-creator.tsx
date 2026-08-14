import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AvatarCreator({
  userId,
  onClose,
  onAvatarUpdated,
}: {
  userId: string;
  onClose: () => void;
  onAvatarUpdated: (url: string) => void;
}) {
  const subdomain = "demo"; // Replace with real RPM subdomain if available
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function subscribe(event: MessageEvent) {
      const json = parse(event);

      if (json?.source !== "readyplayerme") {
        return;
      }

      // Susbribe to all events sent from Ready Player Me once frame is ready
      if (json.eventName === "v1.frame.ready") {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            target: "readyplayerme",
            type: "subscribe",
            eventName: "v1.**",
          }),
          "*",
        );
      }

      // Get avatar GLB URL
      if (json.eventName === "v1.avatar.exported") {
        const avatarUrl = json.data.url;
        handleAvatarExport(avatarUrl);
      }
    }

    function parse(event: MessageEvent) {
      try {
        return typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch (error) {
        return null;
      }
    }

    window.addEventListener("message", subscribe);
    document.addEventListener("message", subscribe as any);

    return () => {
      window.removeEventListener("message", subscribe);
      document.removeEventListener("message", subscribe as any);
    };
  }, []);

  const handleAvatarExport = async (url: string) => {
    try {
      // Use 2D render URL for simpler display
      const renderUrl = url.replace(".glb", ".png");

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: renderUrl })
        .eq("id", userId);

      if (error) throw error;

      toast.success("Avatar updated successfully!");
      onAvatarUpdated(renderUrl);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update avatar");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl h-[85vh] bg-background border border-border rounded-xl overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <h2 className="text-lg font-medium text-foreground">Create Your 3D Avatar</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 w-full relative">
          <iframe
            ref={iframeRef}
            id="frame"
            className="w-full h-full border-none bg-black"
            allow="camera *; microphone *"
            src={`https://${subdomain}.readyplayer.me/avatar?frameApi`}
            title="Ready Player Me Avatar Creator"
          />
        </div>
      </div>
    </div>
  );
}
