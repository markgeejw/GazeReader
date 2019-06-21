#%%
from textstat import textstat
import json

#%%
# with open('../frontend/assets/questions.json') as f:
#     questions = json.load(f)
# for passage in questions['passages']:
#     passage_text = ' '.join(passage['passage'])
#     print('Passage: ', passage_text)
#     print(textstat.flesch_reading_ease(passage_text))


passage_text = """
When men of great intellect, who have long and intently and exclusively given themselves to the study or investigation of some one particular branch of secular knowledge, whose mental life is concentrated and hidden in their chosen pursuit, and who have neither eyes nor ears for any thing which does not immediately bear upon it, when such men are at length made to realize that there is a clamour all around them, which must be heard, for what they have been so little accustomed to place in the category of knowledge as Religion, and that they themselves are accused of disaffection to it, they are impatient at the interruption; they call the demand tyrannical, and the requisitionists bigots or fanatics. They are tempted to say, that their only wish is to be let alone; for themselves, they are not dreaming of offending any one, or interfering with any one; they are pursuing their own particular line, they have never spoken a word against any one's religion, whoever he may be, and never mean to do so. It does not follow that they deny the existence of a God, because they are not found talking of it, when the topic would be utterly irrelevant. {44} All they say is, that there are other beings in the world besides the Supreme Being; their business is with them. After all, the creation is not the Creator, nor things secular religious. Theology and human science are two things, not one, and have their respective provinces, contiguous it may be and cognate to each other, but not identical. When we are contemplating earth, we are not contemplating heaven; and when we are contemplating heaven, we are not contemplating earth. Separate subjects should be treated separately. As division of labour, so division of thought is the only means of successful application. "Let us go our own way," they say, "and you go yours. We do not pretend to lecture on Theology, and you have no claim to pronounce upon Science."
"""
print(textstat.flesch_reading_ease(passage_text))