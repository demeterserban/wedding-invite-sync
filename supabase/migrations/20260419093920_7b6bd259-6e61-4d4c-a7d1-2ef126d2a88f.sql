ALTER TABLE public.rsvps
  ADD COLUMN attending_aug_23 boolean NOT NULL DEFAULT true,
  ADD COLUMN attending_aug_29 boolean NOT NULL DEFAULT true;

-- Validation: if attending overall, must select at least one event
CREATE OR REPLACE FUNCTION public.validate_rsvp_events()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.attending = true AND NEW.attending_aug_23 = false AND NEW.attending_aug_29 = false THEN
    RAISE EXCEPTION 'Trebuie să selectezi cel puțin un eveniment dacă participi.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_rsvp_events_trigger
BEFORE INSERT OR UPDATE ON public.rsvps
FOR EACH ROW
EXECUTE FUNCTION public.validate_rsvp_events();