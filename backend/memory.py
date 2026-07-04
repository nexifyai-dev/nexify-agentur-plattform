import os
import asyncio
import logging

logger = logging.getLogger("nexify.memory")
_client = None


def _get_client():
    global _client
    if _client is None:
        from mem0 import MemoryClient
        _client = MemoryClient(api_key=os.environ["MEM0_API_KEY"])
    return _client


async def mem_add(user_email: str, messages: list[dict], metadata: dict | None = None):
    try:
        client = _get_client()
        def _run():
            return client.add(messages, user_id=user_email.lower(), metadata=metadata or {})
        return await asyncio.to_thread(_run)
    except Exception as e:
        logger.warning(f"mem0 add failed for {user_email}: {e}")
        return None


async def mem_search(user_email: str, query: str, top_k: int = 6) -> list[str]:
    try:
        client = _get_client()
        def _run():
            return client.search(query, filters={"user_id": user_email.lower()}, top_k=top_k)
        res = await asyncio.to_thread(_run)
        items = res.get("results", res) if isinstance(res, dict) else res
        return [i.get("memory", "") for i in (items or []) if isinstance(i, dict) and i.get("memory")]
    except Exception as e:
        logger.warning(f"mem0 search failed for {user_email}: {e}")
        return []
