import ArrayLike from 'src/ArrayLike';

const builder = function (this: any, name: string) {
	this.name = name;
	this.assignments = [... StudentAssignments]
};
const StudentAssignments: any = ArrayLike(builder);
StudentAssignments.push('Take home Test A');
StudentAssignments.push('Homework 1');
StudentAssignments.push('Quiz I');
const studentRecords: Object[] = [
	new StudentAssignments('Joe Smith'),
	new StudentAssignments('Jane Doe')
];

(<any> console.log)(... studentRecords);
