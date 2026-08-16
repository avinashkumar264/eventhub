"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FREELANCER_SPECIALTIES } from "@/lib/validation/provider";
import type { ProviderActionState } from "@/lib/actions/provider";

const inputClass =
  "mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none";

const SPECIALTY_LABEL: Record<(typeof FREELANCER_SPECIALTIES)[number], string> = {
  PHOTOGRAPHY: "Photography",
  MEHENDI: "Mehendi",
  DESIGNING: "Designing",
  MAKEUP: "Makeup",
  FACIAL: "Facial",
  DECORATION: "Decoration",
  CATERING: "Catering",
  OTHER: "Other",
};

export function ProviderProfileForm({
  action,
  isFreelancer,
  defaults,
}: {
  action: (
    prevState: ProviderActionState,
    formData: FormData
  ) => Promise<ProviderActionState>;
  isFreelancer: boolean;
  defaults?: {
    businessName?: string;
    bio?: string;
    city?: string;
    experienceYears?: number | null;
    freelancerSpecialty?: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div>
        <label htmlFor="businessName" className="text-sm font-medium">
          {isFreelancer ? "Display name" : "Business name"}
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          required
          defaultValue={defaults?.businessName}
          className={inputClass}
        />
      </div>

      {isFreelancer && (
        <div>
          <label htmlFor="freelancerSpecialty" className="text-sm font-medium">
            Specialty
          </label>
          <select
            id="freelancerSpecialty"
            name="freelancerSpecialty"
            required
            defaultValue={defaults?.freelancerSpecialty ?? FREELANCER_SPECIALTIES[0]}
            className={inputClass}
          >
            {FREELANCER_SPECIALTIES.map((specialty) => (
              <option key={specialty} value={specialty}>
                {SPECIALTY_LABEL[specialty]}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            defaultValue={defaults?.city}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="experienceYears" className="text-sm font-medium">
            Years of experience
          </label>
          <input
            id="experienceYears"
            name="experienceYears"
            type="number"
            min={0}
            defaultValue={defaults?.experienceYears ?? undefined}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="text-sm font-medium">
          About
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={defaults?.bio}
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-sage">Profile saved.</p>
      )}

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
