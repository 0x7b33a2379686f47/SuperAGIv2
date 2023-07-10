from sqlalchemy.orm import Session

class QdrantHelper:
    
    def __init__(self, session):
        self.session = session
    
    def get_dimensions(self, vector_index):
        return {
            "success": True,
            "dimensions": "1536"
        }
    
    def get_qdrant_index_state(self, vector_index):
        return {
            "success": True,
            "state": "CUSTOM"
        }