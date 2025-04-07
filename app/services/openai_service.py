import requests
from typing import List, Dict, Any, Optional

class OpenAIService:
    BASE_URL = "https://api.openai.com/v1"
    
    def validate_api_key(self, api_key: str) -> bool:
        """Validate OpenAI API key by making a test request"""
        print(f"Validating API key: {api_key[:5]}...")  # Print first 5 chars for debugging
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.get(
                f"{self.BASE_URL}/models",
                headers=headers,
                timeout=10  # Add timeout to prevent hanging
            )
            
            print(f"OpenAI API response status: {response.status_code}")
            if response.status_code != 200:
                print(f"Error response: {response.text}")
                
            return response.status_code == 200
        except Exception as e:
            print(f"Exception during API key validation: {str(e)}")
            return False
            
    @staticmethod
    def validate_api_key_static(api_key: str) -> bool:
        """Static method to validate OpenAI API key by making a test request"""
        service = OpenAIService()
        return service.validate_api_key(api_key)
    
    @staticmethod
    def get_available_models(api_key: str) -> List[Dict[str, str]]:
        """Get available OpenAI models"""
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.get(
                f"{OpenAIService.BASE_URL}/models",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                # Filter only GPT models
                gpt_models = []
                for model in data.get("data", []):
                    model_id = model.get("id", "")
                    if any(x in model_id.lower() for x in ["gpt"]):
                        gpt_models.append({
                            "id": model_id,
                            "name": model_id
                        })
                return gpt_models
            return []
        except Exception:
            return []
    
    @staticmethod
    def enhance_text(api_key: str, model: str, prompt: str, text: str) -> Optional[str]:
        """Use OpenAI to enhance or generate text based on input"""
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": text}
                ],
                "temperature": 0.7,
                "max_tokens": 500
            }
            
            response = requests.post(
                f"{OpenAIService.BASE_URL}/chat/completions",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get("choices", [{}])[0].get("message", {}).get("content")
            return None
        except Exception:
            return None
