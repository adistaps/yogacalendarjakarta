-- ============================================
-- RPC FUNCTIONS
-- ============================================

-- Supabase RPC: reserve_ticket_quota
-- Melakukan atomic decrement kuota dengan lock baris (FOR UPDATE)
-- untuk mencegah race condition (overselling)
CREATE OR REPLACE FUNCTION public.reserve_ticket_quota(
  p_ticket_type_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available INTEGER;
BEGIN
  -- Lock baris untuk tipe tiket yang dipilih
  SELECT (quota - quota_sold)
  INTO v_available
  FROM public.ticket_types
  WHERE id = p_ticket_type_id
  FOR UPDATE;

  -- Jika sisa kuota mencukupi
  IF v_available >= p_quantity THEN
    UPDATE public.ticket_types
    SET quota_sold = quota_sold + p_quantity
    WHERE id = p_ticket_type_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
